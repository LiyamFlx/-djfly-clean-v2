/**
 * Supabase Client for Database Operations
 * Handles user data, session storage, and analytics persistence
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { API_CONFIG, serviceStatus } from '@/config/apiConfig';
import type { SetMetrics, SetInsights } from './analytics';
import type { Database } from '@/types/supabase';

class SupabaseService {
  private client: SupabaseClient<Database> | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const isDemoMode =
      API_CONFIG.supabase.url === 'https://demo.supabase.co' ||
      API_CONFIG.supabase.anonKey === 'demo_anon_key';

    if (!API_CONFIG.supabase.url || !API_CONFIG.supabase.anonKey || isDemoMode) {
      serviceStatus.setServiceStatus('supabase', false);
      this.isConnected = false;
      return;
    }

    try {
      this.client = createClient<Database>(
        API_CONFIG.supabase.url,
        API_CONFIG.supabase.anonKey
      );
      this.testConnection();
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      serviceStatus.setServiceStatus('supabase', false);
      this.isConnected = false;
    }
  }

  private async testConnection() {
    if (!this.client) return;
    try {
      const { error } = await this.client.from('profiles').select('id').limit(1);
      if (error && error.code !== 'PGRST116') throw error;
      this.isConnected = true;
      serviceStatus.setServiceStatus('supabase', true);
    } catch (error) {
      this.isConnected = false;
      serviceStatus.setServiceStatus('supabase', false);
    }
  }

  async saveDJSession(
    userId: string,
    sessionId: string,
    sessionData: SetMetrics,
    insights?: SetInsights
  ): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      this.saveSessionLocally(sessionId, sessionData, insights);
      return false;
    }

    try {
      const { error } = await this.client.from('dj_sessions').insert({
        user_id: userId,
        session_id: sessionId,
        session_data: sessionData as unknown as Database['public']['Tables']['dj_sessions']['Row']['session_data'],
        insights_data: (insights as unknown) as Database['public']['Tables']['dj_sessions']['Row']['insights_data'],
        performance_score: insights?.performanceScore || 0,
      } as Database['public']['Tables']['dj_sessions']['Insert']);

      if (error) throw error;
      return true;
    } catch (error) {
      this.saveSessionLocally(sessionId, sessionData, insights);
      return false;
    }
  }

  async getUserSessions(userId: string, limit: number = 20) {
    if (!this.client || !this.isConnected) {
      return this.getLocalSessions();
    }

    try {
      const { data, error } = await this.client
        .from('dj_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.getLocalSessions();
    }
  }

  async saveUserPreferences(
    userId: string,
    preferences: Partial<Database['public']['Tables']['user_preferences']['Row']>
  ): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      localStorage.setItem(`djfly_preferences_${userId}`, JSON.stringify(preferences));
      return false;
    }

    try {
      const payload: Database['public']['Tables']['user_preferences']['Insert'] = {
        user_id: userId,
        favorite_genres: preferences.favorite_genres,
        preferred_bpm_range: preferences.preferred_bpm_range,
        settings: preferences.settings,
        updated_at: new Date().toISOString(),
      } as Database['public']['Tables']['user_preferences']['Insert'];

      const { error } = await this.client.from('user_preferences').upsert(payload);
      if (error) throw error;
      return true;
    } catch (error) {
      localStorage.setItem(`djfly_preferences_${userId}`, JSON.stringify(preferences));
      return false;
    }
  }

  async getUserPreferences(userId: string) {
    if (!this.client || !this.isConnected) {
      const stored = localStorage.getItem(`djfly_preferences_${userId}`);
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const { data, error } = await this.client
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      const stored = localStorage.getItem(`djfly_preferences_${userId}`);
      return stored ? JSON.parse(stored) : null;
    }
  }

  private saveSessionLocally(
    sessionId: string,
    sessionData: SetMetrics,
    insights?: SetInsights
  ) {
    try {
      localStorage.setItem(
        `djfly_session_${sessionId}`,
        JSON.stringify({ sessionData, insights, timestamp: Date.now() })
      );
      const sessions = this.getLocalSessions();
      sessions.unshift({
        id: sessionId,
        created_at: new Date().toISOString(),
        session_data: sessionData,
        insights_data: insights,
        performance_score: insights?.performanceScore || 0,
      });
      if (sessions.length > 20) sessions.splice(20);
      localStorage.setItem('djfly_local_sessions', JSON.stringify(sessions));
    } catch {}
  }

  private getLocalSessions(): Array<Partial<Database['public']['Tables']['dj_sessions']['Row']>> {
    try {
      const sessions = localStorage.getItem('djfly_local_sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch {
      return [];
    }
  }

  isOnline(): boolean {
    return this.isConnected;
  }

  getClient(): SupabaseClient<Database> | null {
    return this.client;
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;

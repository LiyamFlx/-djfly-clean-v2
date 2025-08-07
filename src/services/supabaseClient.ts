/**
 * Supabase Client for Database Operations
 * Handles user data, session storage, and analytics persistence
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { API_CONFIG, serviceStatus } from '@/config/apiConfig';
import type { SetMetrics, SetInsights } from './analytics';

interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          updated_at?: string;
        };
      };
      dj_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          session_data: SetMetrics;
          insights_data: SetInsights;
          performance_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          session_data: SetMetrics;
          insights_data?: SetInsights;
          performance_score?: number;
          created_at?: string;
        };
        Update: {
          session_data?: SetMetrics;
          insights_data?: SetInsights;
          performance_score?: number;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          favorite_genres: string[];
          preferred_bpm_range: { min: number; max: number };
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          favorite_genres?: string[];
          preferred_bpm_range?: { min: number; max: number };
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          favorite_genres?: string[];
          preferred_bpm_range?: { min: number; max: number };
          settings?: Record<string, any>;
          updated_at?: string;
        };
      };
    };
  };
}

class SupabaseService {
  private client: SupabaseClient<Database> | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (!API_CONFIG.supabase.url || !API_CONFIG.supabase.anonKey) {
      console.warn('⚠️ Supabase not configured. Database features disabled.');
      serviceStatus.setServiceStatus('supabase', false);
      return;
    }

    try {
      this.client = createClient<Database>(
        API_CONFIG.supabase.url,
        API_CONFIG.supabase.anonKey
      );

      this.isConnected = true;
      serviceStatus.setServiceStatus('supabase', true);
      console.log('🗄️ Supabase client initialized');

      // Test connection
      this.testConnection();
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      serviceStatus.setServiceStatus('supabase', false);
    }
  }

  private async testConnection() {
    if (!this.client) return;

    try {
      const { error } = await this.client
        .from('users')
        .select('count')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" which is ok
        throw error;
      }

      console.log('✅ Supabase connection successful');
    } catch (error) {
      console.warn('⚠️ Supabase connection test failed:', error);
      this.isConnected = false;
      serviceStatus.setServiceStatus('supabase', false);
    }
  }

  /**
   * Save DJ session data
   */
  async saveDJSession(
    userId: string,
    sessionId: string,
    sessionData: SetMetrics,
    insights?: SetInsights
  ): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      console.warn('Supabase not available, saving session locally');
      this.saveSessionLocally(sessionId, sessionData, insights);
      return false;
    }

    try {
      const { error } = await this.client.from('dj_sessions').insert({
        user_id: userId,
        session_id: sessionId,
        session_data: sessionData,
        insights_data: insights,
        performance_score: insights?.performanceScore || 0,
      });

      if (error) throw error;

      console.log('💾 DJ session saved to Supabase');
      return true;
    } catch (error) {
      console.error('Failed to save DJ session:', error);
      // Fallback to local storage
      this.saveSessionLocally(sessionId, sessionData, insights);
      return false;
    }
  }

  /**
   * Get user's DJ session history
   */
  async getUserSessions(userId: string, limit: number = 20): Promise<any[]> {
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
      console.error('Failed to get user sessions:', error);
      return this.getLocalSessions();
    }
  }

  /**
   * Save user preferences
   */
  async saveUserPreferences(
    userId: string,
    preferences: {
      favorite_genres?: string[];
      preferred_bpm_range?: { min: number; max: number };
      settings?: Record<string, any>;
    }
  ): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      localStorage.setItem(
        `djfly_preferences_${userId}`,
        JSON.stringify(preferences)
      );
      return false;
    }

    try {
      const { error } = await this.client.from('user_preferences').upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      console.log('⚙️ User preferences saved');
      return true;
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      localStorage.setItem(
        `djfly_preferences_${userId}`,
        JSON.stringify(preferences)
      );
      return false;
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<any> {
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
      console.error('Failed to get user preferences:', error);
      const stored = localStorage.getItem(`djfly_preferences_${userId}`);
      return stored ? JSON.parse(stored) : null;
    }
  }

  /**
   * Fallback: Save session locally
   */
  private saveSessionLocally(
    sessionId: string,
    sessionData: SetMetrics,
    insights?: SetInsights
  ) {
    try {
      localStorage.setItem(
        `djfly_session_${sessionId}`,
        JSON.stringify({
          sessionData,
          insights,
          timestamp: Date.now(),
        })
      );

      // Update sessions list
      const sessions = this.getLocalSessions();
      sessions.unshift({
        id: sessionId,
        created_at: new Date().toISOString(),
        session_data: sessionData,
        insights_data: insights,
        performance_score: insights?.performanceScore || 0,
      });

      // Keep only last 20
      if (sessions.length > 20) {
        sessions.splice(20);
      }

      localStorage.setItem('djfly_local_sessions', JSON.stringify(sessions));
      console.log('💾 Session saved locally as fallback');
    } catch (error) {
      console.error('Failed to save session locally:', error);
    }
  }

  /**
   * Fallback: Get local sessions
   */
  private getLocalSessions(): any[] {
    try {
      const sessions = localStorage.getItem('djfly_local_sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get connection status
   */
  isOnline(): boolean {
    return this.isConnected;
  }

  /**
   * Get client instance (for advanced usage)
   */
  getClient(): SupabaseClient<Database> | null {
    return this.client;
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;

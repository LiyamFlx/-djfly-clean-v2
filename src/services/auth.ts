/**
 * Real Authentication Service
 * Production-ready with proper user management, session handling, and security
 */

import { supabase } from '@/lib/supabase';
import { API_CONFIG } from '@/config/apiConfig';
import { spotifyService } from './spotify';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  isPro: boolean;
  createdAt: string;
  lastLogin: string;
  preferences: {
    defaultGenre: string;
    energyPreference: number;
    autoMix: boolean;
    crossfadeDuration: number;
  };
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  username: string;
}

export class AuthService {
  private currentSession: AuthSession | null = null;
  private sessionRefreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state
   */
  private async initializeAuth(): Promise<void> {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await this.loadUserProfile(session.user.id);
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await this.loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          this.clearSession();
        }
      });
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
    }
  }

  /**
   * Sign up new user
   */
  async signUp(data: SignupData): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            username: data.username,
            created_at: new Date().toISOString(),
            is_pro: false,
            preferences: {
              defaultGenre: 'electronic',
              energyPreference: 0.7,
              autoMix: false,
              crossfadeDuration: 3,
            },
          });

        if (profileError) {
          console.error('❌ Profile creation error:', profileError);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      };
    }
  }

  /**
   * Sign in user
   */
  async signIn(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await this.loadUserProfile(data.user.id);
        await this.updateLastLogin(data.user.id);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.clearSession();
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Password update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password update failed',
      };
    }
  }

  /**
   * Load user profile from database
   */
  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        this.currentSession = {
          user: {
            id: data.id,
            email: data.email,
            username: data.username,
            avatar: data.avatar,
            isPro: data.is_pro,
            createdAt: data.created_at,
            lastLogin: data.last_login || new Date().toISOString(),
            preferences: data.preferences || {
              defaultGenre: 'electronic',
              energyPreference: 0.7,
              autoMix: false,
              crossfadeDuration: 3,
            },
          },
          accessToken: '', // Will be set by Supabase
          refreshToken: '', // Will be set by Supabase
          expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
        };

        this.setupSessionRefresh();
      }
    } catch (error) {
      console.error('❌ Load user profile error:', error);
    }
  }

  /**
   * Update user's last login time
   */
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('❌ Update last login error:', error);
    }
  }

  /**
   * Setup session refresh timer
   */
  private setupSessionRefresh(): void {
    if (this.sessionRefreshTimer) {
      clearTimeout(this.sessionRefreshTimer);
    }

    // Refresh session 5 minutes before expiry
    const refreshTime = this.currentSession?.expiresAt 
      ? this.currentSession.expiresAt - Date.now() - (5 * 60 * 1000)
      : 55 * 60 * 1000; // Default 55 minutes

    this.sessionRefreshTimer = setTimeout(() => {
      this.refreshSession();
    }, refreshTime);
  }

  /**
   * Refresh authentication session
   */
  private async refreshSession(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }

      if (data.session) {
        this.setupSessionRefresh();
      }
    } catch (error) {
      console.error('❌ Session refresh error:', error);
      this.clearSession();
    }
  }

  /**
   * Clear current session
   */
  private clearSession(): void {
    this.currentSession = null;
    if (this.sessionRefreshTimer) {
      clearTimeout(this.sessionRefreshTimer);
      this.sessionRefreshTimer = null;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Check if user is pro
   */
  isProUser(): boolean {
    return this.currentSession?.user.isPro || false;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<User['preferences']>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentSession) {
        throw new Error('No active session');
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          preferences: {
            ...this.currentSession.user.preferences,
            ...preferences,
          },
        })
        .eq('id', this.currentSession.user.id);

      if (error) {
        throw error;
      }

      // Update local session
      if (this.currentSession) {
        this.currentSession.user.preferences = {
          ...this.currentSession.user.preferences,
          ...preferences,
        };
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Update preferences error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update preferences',
      };
    }
  }

  /**
   * Upgrade to pro account
   */
  async upgradeToPro(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentSession) {
        throw new Error('No active session');
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ is_pro: true })
        .eq('id', this.currentSession.user.id);

      if (error) {
        throw error;
      }

      // Update local session
      if (this.currentSession) {
        this.currentSession.user.isPro = true;
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Upgrade to pro error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upgrade to pro',
      };
    }
  }

  /**
   * Get Spotify authentication URL
   */
  getSpotifyAuthUrl(): string {
    return spotifyService.getAuthUrl();
  }

  /**
   * Handle Spotify callback
   */
  async handleSpotifyCallback(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = await spotifyService.exchangeCodeForToken(code);
      
      if (success) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to authenticate with Spotify' };
      }
    } catch (error) {
      console.error('❌ Spotify callback error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Spotify authentication failed',
      };
    }
  }

  /**
   * Check if Spotify is connected
   */
  isSpotifyConnected(): boolean {
    return spotifyService.isAuthenticated();
  }

  /**
   * Disconnect Spotify
   */
  disconnectSpotify(): void {
    spotifyService.clearTokens();
  }
}

// Export singleton instance
export const authService = new AuthService();

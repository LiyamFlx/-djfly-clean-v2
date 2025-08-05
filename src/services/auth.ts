import { cache } from '@/utils/cache';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: 'free' | 'pro' | 'premium';
  preferences: {
    theme: 'dark' | 'light';
    defaultGenre: string;
    autoPlay: boolean;
    crossfadeDuration: number;
  };
  stats: {
    totalSessions: number;
    totalTracks: number;
    favoriteGenres: string[];
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

class AuthService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('djfly_auth_token');
    }
  }

  private saveTokenToStorage(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('djfly_auth_token', token);
    }
    this.token = token;
  }

  private removeTokenFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('djfly_auth_token');
    }
    this.token = null;
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      this.saveTokenToStorage(data.token);
      
      // Cache user data
      cache.set('user_data', data.user, 60 * 60 * 1000); // 1 hour
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Sign up new user
   */
  async signup(userData: SignupData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      this.saveTokenToStorage(data.token);
      
      // Cache user data
      cache.set('user_data', data.user, 60 * 60 * 1000); // 1 hour
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeTokenFromStorage();
      cache.delete('user_data');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    // Check cache first
    const cachedUser = cache.get<User>('user_data');
    if (cachedUser) {
      return cachedUser;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.removeTokenFromStorage();
          return null;
        }
        throw new Error('Failed to get user profile');
      }

      const user = await response.json();
      cache.set('user_data', user, 60 * 60 * 1000); // 1 hour
      
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Update failed');
      }

      const user = await response.json();
      cache.set('user_data', user, 60 * 60 * 1000); // 1 hour
      
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Reset request failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset confirm error:', error);
      throw error;
    }
  }

  /**
   * OAuth login (Google, Spotify, etc.)
   */
  async oauthLogin(provider: 'google' | 'spotify' | 'apple'): Promise<void> {
    const authUrl = `${this.baseUrl}/api/auth/oauth/${provider}`;
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(code: string, state: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/oauth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'OAuth callback failed');
      }

      const data = await response.json();
      this.saveTokenToStorage(data.token);
      
      // Cache user data
      cache.set('user_data', data.user, 60 * 60 * 1000); // 1 hour
      
      return data;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Make authenticated API request
   */
  async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        this.removeTokenFromStorage();
        throw new Error('Authentication required');
      }
      
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  /**
   * Mock authentication for development
   */
  async mockLogin(email: string): Promise<{ user: User; token: string }> {
    // For development/demo purposes
    const mockUser: User = {
      id: 'mock-user-1',
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      subscription: 'pro',
      preferences: {
        theme: 'dark',
        defaultGenre: 'electronic',
        autoPlay: true,
        crossfadeDuration: 3000,
      },
      stats: {
        totalSessions: 42,
        totalTracks: 1337,
        favoriteGenres: ['electronic', 'house', 'techno'],
      },
    };

    const mockToken = 'mock-jwt-token-' + Date.now();
    
    this.saveTokenToStorage(mockToken);
    cache.set('user_data', mockUser, 60 * 60 * 1000);
    
    return { user: mockUser, token: mockToken };
  }
}

export const authService = new AuthService();
export default authService;
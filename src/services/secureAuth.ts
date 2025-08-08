/**
 * Secure Authentication Service
 * Addresses security vulnerabilities in the original auth service
 */

// Add fetch API types
declare global {
  interface RequestInit {
    method?: string;
    headers?: Record<string, string> | string[][];
    body?: string | FormData | URLSearchParams | ReadableStream | null;
    mode?: 'cors' | 'no-cors' | 'same-origin';
    credentials?: 'omit' | 'same-origin' | 'include';
    cache?:
      | 'default'
      | 'no-store'
      | 'reload'
      | 'no-cache'
      | 'force-cache'
      | 'only-if-cached';
    redirect?: 'follow' | 'error' | 'manual';
    referrer?: string;
    referrerPolicy?:
      | 'no-referrer'
      | 'no-referrer-when-downgrade'
      | 'origin'
      | 'origin-when-cross-origin'
      | 'same-origin'
      | 'strict-origin'
      | 'strict-origin-when-cross-origin'
      | 'unsafe-url';
    integrity?: string;
    keepalive?: boolean;
    signal?: AbortSignal | null;
  }
}

import { cache } from '@/utils/cache';

export interface SecureUser {
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

// Input validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Rate limiting for authentication attempts
class RateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly maxAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) return true;

    // Check if lockout period has passed
    if (now - attempt.lastAttempt > this.lockoutDuration) {
      this.attempts.delete(identifier);
      return true;
    }

    return attempt.count < this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (attempt) {
      attempt.count++;
      attempt.lastAttempt = now;
    } else {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    }
  }

  resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

const rateLimiter = new RateLimiter();

class SecureAuthService {
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      // Use sessionStorage instead of localStorage for better security
      this.token = sessionStorage.getItem('djfly_auth_token');
      const expiry = sessionStorage.getItem('djfly_auth_token_expiry');
      if (expiry) {
        this.tokenExpiry = parseInt(expiry, 10);
      }
    }
  }

  private saveTokenToStorage(token: string, expiry: number) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('djfly_auth_token', token);
      sessionStorage.setItem('djfly_auth_token_expiry', expiry.toString());
    }
    this.token = token;
    this.tokenExpiry = expiry;
  }

  private removeTokenFromStorage() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('djfly_auth_token');
      sessionStorage.removeItem('djfly_auth_token_expiry');
    }
    this.token = null;
    this.tokenExpiry = 0;
  }

  private isTokenValid(): boolean {
    return !!(this.token && Date.now() < this.tokenExpiry);
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.token }),
      });

      if (response.ok) {
        const data = await response.json();
        this.saveTokenToStorage(
          data.token,
          Date.now() + data.expires_in * 1000
        );
        return data.token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return null;
  }

  /**
   * Secure login with input validation and rate limiting
   */
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: SecureUser; token: string }> {
    // Input validation
    if (!validateEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(credentials.password)) {
      throw new Error(
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      );
    }

    // Rate limiting
    const identifier = credentials.email;
    if (!rateLimiter.isAllowed(identifier)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    rateLimiter.recordAttempt(identifier);

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizeInput(credentials.email),
          password: credentials.password, // Don't sanitize password
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();

      // Validate token before saving
      if (!(await this.validateToken(data.token))) {
        throw new Error('Invalid authentication token received');
      }

      this.saveTokenToStorage(data.token, Date.now() + data.expires_in * 1000);
      rateLimiter.resetAttempts(identifier);

      // Cache user data securely
      cache.set('user_data', data.user, 60 * 60 * 1000); // 1 hour

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Secure signup with input validation
   */
  async signup(
    userData: SignupData
  ): Promise<{ user: SecureUser; token: string }> {
    // Input validation
    if (!validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(userData.password)) {
      throw new Error(
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      );
    }

    if (userData.name.length < 2 || userData.name.length > 50) {
      throw new Error('Name must be between 2 and 50 characters');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizeInput(userData.email),
          password: userData.password,
          name: sanitizeInput(userData.name),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();

      // Validate token before saving
      if (!(await this.validateToken(data.token))) {
        throw new Error('Invalid authentication token received');
      }

      this.saveTokenToStorage(data.token, Date.now() + data.expires_in * 1000);

      // Cache user data securely
      cache.set('user_data', data.user, 60 * 60 * 1000); // 1 hour

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Secure logout
   */
  async logout(): Promise<void> {
    try {
      if (this.token && this.isTokenValid()) {
        await fetch(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
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
   * Get current user with token validation
   */
  async getCurrentUser(): Promise<SecureUser | null> {
    if (!this.isTokenValid()) {
      // Try to refresh token
      const newToken = await this.refreshToken();
      if (!newToken) {
        this.removeTokenFromStorage();
        return null;
      }
    }

    // Check cache first
    const cachedUser = cache.get<SecureUser>('user_data');
    if (cachedUser) {
      return cachedUser;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
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
   * Update user profile with validation
   */
  async updateProfile(updates: Partial<SecureUser>): Promise<SecureUser> {
    if (!this.isTokenValid()) {
      throw new Error('Not authenticated');
    }

    // Validate updates
    if (updates.email && !validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.name && (updates.name.length < 2 || updates.name.length > 50)) {
      throw new Error('Name must be between 2 and 50 characters');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
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
   * Request password reset with email validation
   */
  async requestPasswordReset(email: string): Promise<void> {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: sanitizeInput(email) }),
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
   * Reset password with token validation
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!validatePassword(newPassword)) {
      throw new Error(
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      );
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api/auth/reset-password/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, password: newPassword }),
        }
      );

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
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  /**
   * Get auth token (for API requests)
   */
  getToken(): string | null {
    return this.isTokenValid() ? this.token : null;
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  async apiRequest<T>(
    endpoint: string,
    options: {
      method?: string;
      headers?: Record<string, string> | string[][];
      body?: string | FormData | URLSearchParams | ReadableStream | null;
      mode?: 'cors' | 'no-cors' | 'same-origin';
      credentials?: 'omit' | 'same-origin' | 'include';
      cache?:
        | 'default'
        | 'no-store'
        | 'reload'
        | 'no-cache'
        | 'force-cache'
        | 'only-if-cached';
      redirect?: 'follow' | 'error' | 'manual';
      referrer?: string;
      referrerPolicy?:
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url';
      integrity?: string;
      keepalive?: boolean;
      signal?: AbortSignal | null;
    } = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    // Ensure token is valid
    if (!this.isTokenValid()) {
      const newToken = await this.refreshToken();
      if (!newToken) {
        throw new Error('Authentication required');
      }
    }

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await this.refreshToken();
        if (!newToken) {
          this.removeTokenFromStorage();
          throw new Error('Authentication required');
        }
        // Retry request with new token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.token}`,
        };
        const retryResponse = await fetch(url, config);
        if (!retryResponse.ok) {
          throw new Error('Request failed after token refresh');
        }
        return retryResponse.json();
      }

      const error = await response
        .json()
        .catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }
}

export const secureAuthService = new SecureAuthService();
export default secureAuthService;

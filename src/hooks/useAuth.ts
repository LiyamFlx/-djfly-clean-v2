import { useState, useEffect, useCallback } from 'react';
import {
  authService,
  type User,
  type LoginCredentials,
  type SignupData,
} from '@/services/auth';

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use mock login for development if no backend is available
      const isDevelopment = import.meta.env.DEV;
      const result = isDevelopment
        ? await authService.mockLogin(credentials.email)
        : await authService.login(credentials);

      setUser(result.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use mock login for development if no backend is available
      const isDevelopment = import.meta.env.DEV;
      const result = isDevelopment
        ? await authService.mockLogin(userData.email)
        : await authService.signup(userData);

      setUser(result.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!user) {
        throw new Error('No user logged in');
      }

      setIsLoading(true);
      setError(null);

      try {
        const updatedUser = await authService.updateProfile(updates);
        setUser(updatedUser);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Profile update failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.requestPasswordReset(email);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Password reset request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await authService.resetPassword(token, newPassword);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Password reset failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    clearError,
  };
}

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
  updateProfile: (updates: Partial<User['preferences']>) => Promise<void>;
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
        const currentUser = authService.getCurrentUser();
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
      // Use secure auth service
      const result = await authService.signIn(credentials);
      if (result.success) {
        setUser(authService.getCurrentUser());
      } else {
        throw new Error(result.error || 'Login failed');
      }
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
      // Use secure auth service
      const result = await authService.signUp(userData);
      if (result.success) {
        setUser(authService.getCurrentUser());
      } else {
        throw new Error(result.error || 'Signup failed');
      }
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
      await authService.signOut();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<User['preferences']>) => {
      if (!user) {
        throw new Error('No user logged in');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await authService.updatePreferences(updates);
      if (result.success) {
          setUser(authService.getCurrentUser());
      } else {
          throw new Error(result.error || 'Profile update failed');
      }
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
      const result = await authService.resetPassword(email);
      if (!result.success) {
        throw new Error(result.error || 'Password reset request failed');
      }
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
        const result = await authService.updatePassword(newPassword);
      if (!result.success) {
        throw new Error(result.error || 'Password reset failed');
      }
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

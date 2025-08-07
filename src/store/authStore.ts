/**
 * Authentication Store with Guest Mode Support
 * Handles user authentication state and guest session management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  isPro: boolean;
  createdAt: string;
}

export interface GuestSession {
  id: string;
  startTime: number;
  duration: number; // seconds
  maxDuration: number; // 10 minutes = 600 seconds
  features: string[];
  limitations: string[];
}

interface AuthState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Guest state
  isGuestMode: boolean;
  guestSession: GuestSession | null;
  guestTimeRemaining: number;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  enableGuestMode: () => void;
  exitGuestMode: () => void;
  updateGuestTime: () => void;
  extendGuestSession: () => void;

  // Permissions
  canAccessFeature: (feature: string) => boolean;
  getFeatureLimitations: () => string[];
}

const GUEST_MAX_DURATION = 10 * 60; // 10 minutes in seconds

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isGuestMode: false,
      guestSession: null,
      guestTimeRemaining: 0,

      // Authentication actions
      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isGuestMode: false,
          guestSession: null,
          guestTimeRemaining: 0,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isGuestMode: false,
          guestSession: null,
          guestTimeRemaining: 0,
        });
      },

      // Guest mode actions
      enableGuestMode: () => {
        const startTime = Date.now();
        const guestSession: GuestSession = {
          id: `guest_${startTime}`,
          startTime,
          duration: 0,
          maxDuration: GUEST_MAX_DURATION,
          features: [
            'demo-tracks',
            'basic-mixing',
            'effects',
            'sharing',
            'analytics-basic',
          ],
          limitations: [
            '10-minute session limit',
            'Demo tracks only (12 tracks)',
            'Watermarked sharing',
            'Cannot save sets',
            'No AI recommendations',
            'No Spotify integration',
          ],
        };

        set({
          isGuestMode: true,
          guestSession,
          guestTimeRemaining: GUEST_MAX_DURATION,
          isAuthenticated: false,
          user: null,
        });

        // Start countdown timer
        const interval = setInterval(() => {
          const state = get();
          if (!state.isGuestMode || !state.guestSession) {
            clearInterval(interval);
            return;
          }

          const elapsed = Math.floor(
            (Date.now() - state.guestSession.startTime) / 1000
          );
          const remaining = Math.max(0, GUEST_MAX_DURATION - elapsed);

          if (remaining <= 0) {
            clearInterval(interval);
            // Auto-exit guest mode when time expires
            get().exitGuestMode();
            return;
          }

          set({
            guestTimeRemaining: remaining,
            guestSession: {
              ...state.guestSession,
              duration: elapsed,
            },
          });
        }, 1000);
      },

      exitGuestMode: () => {
        set({
          isGuestMode: false,
          guestSession: null,
          guestTimeRemaining: 0,
        });
      },

      updateGuestTime: () => {
        const state = get();
        if (!state.guestSession) return;

        const elapsed = Math.floor(
          (Date.now() - state.guestSession.startTime) / 1000
        );
        const remaining = Math.max(0, GUEST_MAX_DURATION - elapsed);

        set({
          guestTimeRemaining: remaining,
          guestSession: {
            ...state.guestSession,
            duration: elapsed,
          },
        });
      },

      extendGuestSession: () => {
        const state = get();
        if (!state.guestSession) return;

        // Extend by another 5 minutes (one time only)
        const newMaxDuration = state.guestSession.maxDuration + 5 * 60;
        const elapsed = state.guestSession.duration;
        const remaining = Math.max(0, newMaxDuration - elapsed);

        set({
          guestTimeRemaining: remaining,
          guestSession: {
            ...state.guestSession,
            maxDuration: newMaxDuration,
          },
        });
      },

      // Permission system
      canAccessFeature: (feature: string) => {
        const state = get();

        // Authenticated users have full access
        if (state.isAuthenticated && state.user) {
          return true;
        }

        // Guest users have limited access
        if (state.isGuestMode && state.guestSession) {
          return state.guestSession.features.includes(feature);
        }

        // No access for unauthenticated users
        return false;
      },

      getFeatureLimitations: () => {
        const state = get();

        if (state.isAuthenticated && state.user) {
          return []; // No limitations for authenticated users
        }

        if (state.isGuestMode && state.guestSession) {
          return state.guestSession.limitations;
        }

        return ['Please sign in to access features'];
      },
    }),
    {
      name: 'djfly-auth-storage',
      // Don't persist guest sessions (they should expire)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Exclude guest mode state from persistence
      }),
    }
  )
);

// Helper hooks for common auth patterns
export const useAuth = () => {
  const { user, isAuthenticated, isGuestMode } = useAuthStore();
  return { user, isAuthenticated, isGuestMode };
};

export const useGuestSession = () => {
  const {
    isGuestMode,
    guestSession,
    guestTimeRemaining,
    exitGuestMode,
    extendGuestSession,
  } = useAuthStore();

  return {
    isGuestMode,
    guestSession,
    guestTimeRemaining,
    exitGuestMode,
    extendGuestSession,
    // Helper computed values
    timeRemainingFormatted: formatTime(guestTimeRemaining),
    isTimeRunningLow: guestTimeRemaining < 120, // Less than 2 minutes
    canExtendSession: guestSession?.maxDuration === GUEST_MAX_DURATION,
  };
};

export const usePermissions = () => {
  const { canAccessFeature, getFeatureLimitations } = useAuthStore();
  return { canAccessFeature, getFeatureLimitations };
};

// Utility function to format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

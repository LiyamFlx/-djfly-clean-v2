import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface ProgressState {
  currentStep: number;
  completedSteps: number[];
  stepProgress: Record<string, number>;
  sessionData: {
    startTime: number;
    lastActivity: number;
    featuresUsed: string[];
    playlistsCreated: number;
  };
}

export const useProgressTracking = () => {
  const location = useLocation();

  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem('djfly-progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to default
      }
    }

    return {
      currentStep: 1,
      completedSteps: [],
      stepProgress: {},
      sessionData: {
        startTime: Date.now(),
        lastActivity: Date.now(),
        featuresUsed: [],
        playlistsCreated: 0,
      },
    };
  });

  // Step mapping
  const getStepFromPath = useCallback((path: string): number => {
    if (path === '/') return 1;
    if (path === '/studio') return 2;
    if (path.includes('/match') || path.includes('/set')) return 3;
    if (path === '/player') return 4;
    return 1;
  }, []);

  // Update progress when location changes
  useEffect(() => {
    const currentStep = getStepFromPath(location.pathname);

    setProgress((prev) => {
      const updated = {
        ...prev,
        currentStep,
        completedSteps: Array.from(
          new Set([...prev.completedSteps, currentStep])
        ),
        sessionData: {
          ...prev.sessionData,
          lastActivity: Date.now(),
        },
      };

      // Persist to localStorage
      localStorage.setItem('djfly-progress', JSON.stringify(updated));
      return updated;
    });
  }, [location.pathname, getStepFromPath]);

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string, metadata?: any) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        sessionData: {
          ...prev.sessionData,
          lastActivity: Date.now(),
          featuresUsed: Array.from(
            new Set([...prev.sessionData.featuresUsed, feature])
          ),
          playlistsCreated:
            feature === 'playlist_created'
              ? prev.sessionData.playlistsCreated + 1
              : prev.sessionData.playlistsCreated,
        },
      };

      localStorage.setItem('djfly-progress', JSON.stringify(updated));

      // Analytics tracking (if needed)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'feature_used', {
          feature_name: feature,
          step: prev.currentStep,
          session_duration: Date.now() - prev.sessionData.startTime,
          ...metadata,
        });
      }

      return updated;
    });
  }, []);

  // Update step progress (for within-step progress)
  const updateStepProgress = useCallback((step: string, progress: number) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        stepProgress: {
          ...prev.stepProgress,
          [step]: Math.max(0, Math.min(100, progress)),
        },
      };

      localStorage.setItem('djfly-progress', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get suggestions for next actions
  const getNextActionSuggestion = useCallback(() => {
    const { currentStep, completedSteps, sessionData } = progress;

    if (currentStep === 1 && !completedSteps.includes(2)) {
      return {
        action: 'Try Magic Studio',
        path: '/studio',
        reason: 'Start creating your first AI playlist',
      };
    }

    if (
      currentStep === 2 &&
      !sessionData.featuresUsed.includes('magic-match') &&
      !sessionData.featuresUsed.includes('magic-set')
    ) {
      return {
        action: 'Choose Your Path',
        path: '/studio',
        reason: 'Select Magic Match or Magic Set to begin',
      };
    }

    if (sessionData.playlistsCreated > 0 && !completedSteps.includes(4)) {
      return {
        action: 'Go to Player',
        path: '/player',
        reason: 'Your playlist is ready to play!',
      };
    }

    if (sessionData.playlistsCreated === 0) {
      return {
        action: 'Create Your First Playlist',
        path: '/studio/set',
        reason: 'Experience the AI magic',
      };
    }

    return null;
  }, [progress]);

  // Calculate overall completion percentage
  const getCompletionPercentage = useCallback(() => {
    const stepWeight = 25; // Each step worth 25%
    const featureBonus = Math.min(
      20,
      progress.sessionData.featuresUsed.length * 5
    );
    const playlistBonus = Math.min(
      10,
      progress.sessionData.playlistsCreated * 5
    );

    return Math.min(
      100,
      progress.completedSteps.length * stepWeight + featureBonus + playlistBonus
    );
  }, [progress]);

  // Reset progress (for testing or user request)
  const resetProgress = useCallback(() => {
    const defaultProgress: ProgressState = {
      currentStep: 1,
      completedSteps: [],
      stepProgress: {},
      sessionData: {
        startTime: Date.now(),
        lastActivity: Date.now(),
        featuresUsed: [],
        playlistsCreated: 0,
      },
    };

    setProgress(defaultProgress);
    localStorage.setItem('djfly-progress', JSON.stringify(defaultProgress));
  }, []);

  return {
    progress,
    trackFeatureUsage,
    updateStepProgress,
    getNextActionSuggestion,
    getCompletionPercentage,
    resetProgress,
    isFirstTime: progress.sessionData.featuresUsed.length === 0,
    sessionDuration: Date.now() - progress.sessionData.startTime,
  };
};

export default useProgressTracking;

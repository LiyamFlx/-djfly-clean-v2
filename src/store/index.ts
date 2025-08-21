import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
// import { getAiPlaylist } from '@/services/api';
import type {
  Track,
  AudioState,
  CrowdState,
  AIState,
  SessionState,
  UIState,
} from '@/types';

interface DJflyStore {
  // Audio slice
  audio: AudioState;

  // Crowd analysis slice
  crowd: CrowdState;

  // AI generation slice
  ai: AIState;

  // Session slice
  session: SessionState;

  // UI slice
  ui: UIState;

  // Audio actions
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  togglePlayback: () => void;
  setVolume: (volume: number) => void;
  updateProgress: (currentTime: number, duration: number) => void;

  // Crowd actions
  startListening: () => void;
  stopListening: () => void;
  updateCrowdMetrics: (metrics: Partial<CrowdState>) => void;

  // AI actions
  generateSet: (prompt: string) => Promise<void>;
  analyzeAudio: (audioData: ArrayBuffer) => Promise<void>;
  getReplacementTrack: (trackToReplace: Track, context: any) => Promise<void>;

  // Session actions
  startSession: () => void;
  endSession: () => void;
  updateSessionMetrics: (metrics: Partial<SessionState>) => void;

  // UI actions
  setCurrentPage: (page: string) => void;
  toggleOnboarding: () => void;
  setMobileView: (isMobile: boolean) => void;
}

export const useDJflyStore = create<DJflyStore>()(
  immer((set) => ({
    // Initial state
    audio: {
      isPlaying: false,
      currentTrack: null,
      queue: [],
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isLoading: false,
      error: null,
      repeat: 'none',
      shuffle: false,
      crossfadeTime: 3,
      isListening: false,
    },

    crowd: {
      isListening: false,
      currentEnergy: 0.5,
      mood: 'medium',
      engagementLevel: 'medium',
      crowdSize: 0,
      energyTrend: 'stable',
      bpmPreference: 120,
      dominantGenres: [],
      lastUpdated: null,
    },

    ai: {
      isAnalyzing: false,
      confidence: 0,
      lastAnalysis: null,
      recommendations: [],
      replacementSuggestion: null,
    },

    session: {
      id: null,
      startTime: null,
      totalTracks: 0,
      mixedMinutes: 0,
      crowdFeedback: null,
      averageEnergy: 0,
      isActive: false,
    },

    ui: {
      isLoading: false,
      activeModal: null,
      notifications: [],
    },

    // Audio actions
    setCurrentTrack: (track) =>
      set((state) => {
        state.audio.currentTrack = track;
      }),

    setQueue: (tracks) =>
      set((state) => {
        state.audio.queue = tracks;
      }),

    addToQueue: (track) =>
      set((state) => {
        state.audio.queue.push(track);
      }),

    removeFromQueue: (trackId) =>
      set((state) => {
        state.audio.queue = state.audio.queue.filter((t) => t.id !== trackId);
      }),

    togglePlayback: () =>
      set((state) => {
        state.audio.isPlaying = !state.audio.isPlaying;
      }),

    setVolume: (volume) =>
      set((state) => {
        state.audio.volume = Math.max(0, Math.min(1, volume));
      }),

    updateProgress: (currentTime, duration) =>
      set((state) => {
        state.audio.currentTime = currentTime;
        state.audio.duration = duration;
      }),

    // Crowd actions
    startListening: () =>
      set((state) => {
        state.crowd.isListening = true;
        state.crowd.lastUpdated = new Date();
      }),

    stopListening: () =>
      set((state) => {
        state.crowd.isListening = false;
      }),

    updateCrowdMetrics: (metrics) =>
      set((state) => {
        Object.assign(state.crowd, metrics);
        state.crowd.lastUpdated = new Date();
      }),

    // AI actions
    generateSet: async (_prompt) => {
      set((state) => {
        state.ai.isAnalyzing = true;
        state.ai.confidence = 0;
        state.ai.recommendations = [];
      });

      try {
        // const tracks = await getAiPlaylist(prompt, onProgress);
        const tracks: Track[] = [];

        set((state) => {
          state.ai.recommendations = [
            { tracks, energy: 85, mood: 'energetic' },
          ];
          state.ai.isAnalyzing = false;
          state.ai.confidence = 0.9;
        });
      } catch (_error) {
        console.error('Error in generateSet store action:', _error);
        set((state) => {
          state.ai.isAnalyzing = false;
        });
      }
    },

    analyzeAudio: async (audioData: ArrayBuffer) => {
      set((state) => {
        state.crowd.isListening = true;
      });

      try {
        // Simulate audio analysis
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Generate mock crowd metrics
        const moods: Array<'excited' | 'chill' | 'energetic' | 'mellow'> = [
          'excited',
          'chill',
          'energetic',
          'mellow',
        ];
        const engagements: Array<'low' | 'medium' | 'high'> = [
          'low',
          'medium',
          'high',
        ];

        const mockMetrics = {
          currentEnergy: Math.random() * 0.4 + 0.3, // 0.3 to 0.7
          mood: moods[Math.floor(Math.random() * 4)],
          engagementLevel: engagements[Math.floor(Math.random() * 3)],
          crowdSize: Math.floor(Math.random() * 200) + 50,
        };

        // Log audio data analysis (in real implementation, would analyze the buffer)
        console.log('Analyzing audio data of length:', audioData.byteLength);

        set((state) => {
          Object.assign(state.crowd, mockMetrics);
          state.crowd.isListening = false;
          state.crowd.lastUpdated = new Date();
        });
      } catch (error) {
        console.error('Audio analysis error:', error);
        set((state) => {
          state.crowd.isListening = false;
        });
      }
    },

    getReplacementTrack: async (trackToReplace, context) => {
      set((state) => {
        state.ai.isAnalyzing = true;
        state.ai.replacementSuggestion = null;
      });

      try {
        const { aiMusicEngine } = await import('@/services/aiMusicEngine');
        const replacement = await aiMusicEngine.getReplacementTrack(
          trackToReplace,
          context
        );
        set((state) => {
          state.ai.replacementSuggestion = replacement;
          state.ai.isAnalyzing = false;
        });
      } catch (error) {
        console.error('Error getting replacement track:', error);
        set((state) => {
          state.ai.isAnalyzing = false;
        });
      }
    },

    // Session actions
    startSession: () =>
      set((state) => {
        state.session.sessionId = Math.random().toString(36).substring(2);
        state.session.startTime = new Date();
        state.session.totalTracks = 0;
      }),

    endSession: () =>
      set((state) => {
        state.session.startTime = null;
      }),

    updateSessionMetrics: (metrics) =>
      set((state) => {
        Object.assign(state.session, metrics);
      }),

    // UI actions
    setLoading: (isLoading: boolean) =>
      set((state) => {
        state.ui.isLoading = isLoading;
      }),

    setActiveModal: (modalId: string | null) =>
      set((state) => {
        state.ui.activeModal = modalId;
      }),
  }))
);

// Selector hooks for easier usage
export const useAudioState = () => useDJflyStore((state) => state.audio);
export const useCrowdState = () => useDJflyStore((state) => state.crowd);
export const useAIState = () => useDJflyStore((state) => state.ai);
export const useSessionState = () => useDJflyStore((state) => state.session);
export const useUIState = () => useDJflyStore((state) => state.ui);

// Action hooks with useShallow to prevent infinite re-renders
export const useAudioActions = () =>
  useDJflyStore(
    useShallow((state) => ({
      setCurrentTrack: state.setCurrentTrack,
      setQueue: state.setQueue,
      addToQueue: state.addToQueue,
      removeFromQueue: state.removeFromQueue,
      togglePlayback: state.togglePlayback,
      setVolume: state.setVolume,
      updateProgress: state.updateProgress,
    }))
  );

export const useCrowdActions = () =>
  useDJflyStore(
    useShallow((state) => ({
      startListening: state.startListening,
      stopListening: state.stopListening,
      updateCrowdMetrics: state.updateCrowdMetrics,
    }))
  );

export const useAIActions = () =>
  useDJflyStore(
    useShallow((state) => ({
      generateSet: state.generateSet,
      analyzeAudio: state.analyzeAudio,
      getReplacementTrack: state.getReplacementTrack,
    }))
  );

export const useSessionActions = () =>
  useDJflyStore(
    useShallow((state) => ({
      startSession: state.startSession,
      endSession: state.endSession,
      updateSessionMetrics: state.updateSessionMetrics,
    }))
  );

export const useUIActions = () =>
  useDJflyStore(
    useShallow((state) => ({
      setCurrentPage: state.setCurrentPage,
      toggleOnboarding: state.toggleOnboarding,
      setMobileView: state.setMobileView,
    }))
  );

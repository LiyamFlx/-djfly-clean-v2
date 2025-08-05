import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { 
  Track, 
  AudioState, 
  CrowdState, 
  AIState, 
  SessionState, 
  UIState
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
      crossfadeTime: 3,
    },
    
    crowd: {
      isListening: false,
      currentEnergy: 0.5,
      mood: 'unknown',
      engagementLevel: 'medium',
      crowdSize: 0,
      averageAge: 25,
      energyTrend: 'stable',
      lastUpdated: null,
    },
    
    ai: {
      isGenerating: false,
      prompt: '',
      generatedTracks: [],
      error: null,
      progress: 0,
    },
    
    session: {
      sessionId: '',
      startTime: null,
      totalTracks: 0,
      averageTrackRating: 0,
      setFlow: 'maintain',
      crowdSatisfaction: 0.7,
    },
    
    ui: {
      currentPage: 'home',
      showOnboarding: true,
      theme: 'dark',
      isMobileView: false,
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
        state.audio.queue = state.audio.queue.filter(t => t.id !== trackId);
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
    generateSet: async (prompt) => {
      set((state) => {
        state.ai.isGenerating = true;
        state.ai.prompt = prompt;
        state.ai.error = null;
        state.ai.progress = 0;
      });

      try {
        // Simulate AI generation with demo tracks
        const demoTracks: Track[] = [
          {
            id: '1',
            title: 'Electronic Vibes',
            artist: 'AI Generated',
            duration: 180,
            image: 'https://via.placeholder.com/300x300/00D4FF/FFFFFF?text=Track+1',
            source: 'demo',
            bpm: 128,
            energy: 0.8,
            valence: 0.7,
          },
          {
            id: '2',
            title: 'Deep House Mix',
            artist: 'AI Generated',
            duration: 240,
            image: 'https://via.placeholder.com/300x300/00FFCC/FFFFFF?text=Track+2',
            source: 'demo',
            bpm: 122,
            energy: 0.6,
            valence: 0.8,
          },
        ];

        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          set((state) => {
            state.ai.progress = i;
          });
        }

        set((state) => {
          state.ai.generatedTracks = demoTracks;
          state.ai.isGenerating = false;
          state.audio.queue = demoTracks;
        });

      } catch (_error) {
        set((state) => {
          state.ai.error = _error instanceof Error ? _error.message : 'Generation failed';
          state.ai.isGenerating = false;
        });
      }
    },
    
    analyzeAudio: async (_audioData: ArrayBuffer) => {
      set((state) => {
        state.crowd.isListening = true;
      });

      try {
        // Simulate audio analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock crowd metrics
        const mockMetrics = {
          currentEnergy: Math.random() * 0.4 + 0.3, // 0.3 to 0.7
          mood: ['excited', 'chill', 'energetic', 'mellow'][Math.floor(Math.random() * 4)] as any,
          engagementLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          crowdSize: Math.floor(Math.random() * 200) + 50,
        };

        set((state) => {
          Object.assign(state.crowd, mockMetrics);
          state.crowd.isListening = false;
          state.crowd.lastUpdated = new Date();
        });

      } catch (_error) {
        set((state) => {
          state.crowd.isListening = false;
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
    setCurrentPage: (page) =>
      set((state) => {
        state.ui.currentPage = page;
      }),
      
    toggleOnboarding: () =>
      set((state) => {
        state.ui.showOnboarding = !state.ui.showOnboarding;
      }),
      
    setMobileView: (isMobile) =>
      set((state) => {
        state.ui.isMobileView = isMobile;
      }),
  }))
);

// Selector hooks for easier usage
export const useAudioState = () => useDJflyStore((state) => state.audio);
export const useCrowdState = () => useDJflyStore((state) => state.crowd);
export const useAIState = () => useDJflyStore((state) => state.ai);
export const useSessionState = () => useDJflyStore((state) => state.session);
export const useUIState = () => useDJflyStore((state) => state.ui);

// Action hooks
export const useAudioActions = () => useDJflyStore((state) => ({
  setCurrentTrack: state.setCurrentTrack,
  setQueue: state.setQueue,
  addToQueue: state.addToQueue,
  removeFromQueue: state.removeFromQueue,
  togglePlayback: state.togglePlayback,
  setVolume: state.setVolume,
  updateProgress: state.updateProgress,
}));

export const useCrowdActions = () => useDJflyStore((state) => ({
  startListening: state.startListening,
  stopListening: state.stopListening,
  updateCrowdMetrics: state.updateCrowdMetrics,
}));

export const useAIActions = () => useDJflyStore((state) => ({
  generateSet: state.generateSet,
  analyzeAudio: state.analyzeAudio,
}));

export const useSessionActions = () => useDJflyStore((state) => ({
  startSession: state.startSession,
  endSession: state.endSession,
  updateSessionMetrics: state.updateSessionMetrics,
}));

export const useUIActions = () => useDJflyStore((state) => ({
  setCurrentPage: state.setCurrentPage,
  toggleOnboarding: state.toggleOnboarding,
  setMobileView: state.setMobileView,
}));
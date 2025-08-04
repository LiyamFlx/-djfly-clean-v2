import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { 
  Track, 
  AudioState, 
  CrowdState, 
  AIState, 
  SessionState, 
  UIState,
  AuthState,
} from '@/types';
import { User, Session } from '@supabase/supabase-js';

interface DJflyStore {
  // Auth slice
  auth: AuthState;

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

  // Auth actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  
  // Audio actions
  setTrackForDeck: (deck: 'A' | 'B', track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  toggleDeckPlayback: (deck: 'A' | 'B') => void;
  setVolume: (volume: number) => void;
  updateDeckProgress: (deck: 'A' | 'B', currentTime: number, duration: number) => void;
  setCrossfader: (value: number) => void;
  
  // Crowd actions
  startListening: () => void;
  stopListening: () => void;
  updateCrowdMetrics: (metrics: Partial<CrowdState>) => void;
  
  // AI actions
  generateSet: (prompt: string) => Promise<void>;
  analyzeAudio: (audioData: ArrayBuffer) => Promise<void>;
  fetchSavedSets: () => Promise<void>;
  deleteSet: (setId: string) => Promise<void>;
  
  // Session actions
  startSession: () => void;
  endSession: () => void;
  updateSessionMetrics: (metrics: Partial<SessionState>) => void;
  
  // UI actions
  setCurrentPage: (page: string) => void;
  toggleOnboarding: () => void;
  setMobileView: (isMobile: boolean) => void;
  setMasterTabId: (tabId: string) => void;
}

export const useDJflyStore = create<DJflyStore>()(
  immer((set) => ({
    // Initial state
    auth: {
      user: null,
      session: null,
    },
    audio: {
      deckA: {
        track: null,
        currentTime: 0,
        duration: 0,
        isPlaying: false,
      },
      deckB: {
        track: null,
        currentTime: 0,
        duration: 0,
        isPlaying: false,
      },
      queue: [],
      crossfader: 0.5,
      volume: 0.8,
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
      savedSets: [],
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
      masterTabId: null,
    },
    
    // Audio actions
    setTrackForDeck: (deck, track) =>
      set((state) => {
        if (deck === 'A') {
          state.audio.deckA.track = track;
        } else {
          state.audio.deckB.track = track;
        }
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

    toggleDeckPlayback: (deck) =>
      set((state) => {
        if (deck === 'A') {
          state.audio.deckA.isPlaying = !state.audio.deckA.isPlaying;
        } else {
          state.audio.deckB.isPlaying = !state.audio.deckB.isPlaying;
        }
      }),

    setVolume: (volume) =>
      set((state) => {
        state.audio.volume = Math.max(0, Math.min(1, volume));
      }),

    updateDeckProgress: (deck, currentTime, duration) =>
      set((state) => {
        if (deck === 'A') {
          state.audio.deckA.currentTime = currentTime;
          state.audio.deckA.duration = duration;
        } else {
          state.audio.deckB.currentTime = currentTime;
          state.audio.deckB.duration = duration;
        }
      }),

    setCrossfader: (value) =>
      set((state) => {
        state.audio.crossfader = value;
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
        const response = await fetch('/.netlify/functions/generate-set', {
          method: 'POST',
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate set');
        }

        const { tracks } = await response.json();

        const enrichedTracks = await Promise.all(
          tracks.map(async (track: any) => {
            const searchResponse = await fetch('/.netlify/functions/spotify-proxy', {
              method: 'POST',
              body: JSON.stringify({
                endpoint: 'search',
                q: `${track.title} ${track.artist}`,
                type: 'track',
                limit: 1,
              }),
            });

            if (!searchResponse.ok) {
              return { ...track, source: 'demo' }; // Keep placeholder if search fails
            }

            const searchData = await searchResponse.json();
            const spotifyTrack = searchData.tracks?.items[0];

            if (spotifyTrack) {
              return {
                id: spotifyTrack.id,
                title: spotifyTrack.name,
                artist: spotifyTrack.artists.map((a: any) => a.name).join(', '),
                duration: spotifyTrack.duration_ms / 1000,
                image: spotifyTrack.album.images[0]?.url,
                preview_url: spotifyTrack.preview_url,
                spotify_url: spotifyTrack.external_urls.spotify,
                source: 'spotify',
                bpm: spotifyTrack.tempo,
                key: spotifyTrack.key,
                energy: spotifyTrack.energy,
                valence: spotifyTrack.valence,
                danceability: spotifyTrack.danceability,
                popularity: spotifyTrack.popularity,
              };
            }

            return { ...track, source: 'demo' }; // Keep placeholder if no track found
          })
        );

        set((state) => {
          state.ai.generatedTracks = enrichedTracks;
          state.ai.isGenerating = false;
          state.audio.queue = enrichedTracks;
        });
      } catch (_error) {
        set((state) => {
          state.ai.error = _error instanceof Error ? _error.message : 'Generation failed';
          state.ai.isGenerating = false;
        });
      }
    },

    fetchSavedSets: async () => {
      const { auth } = useDJflyStore.getState();
      if (!auth.user) return;

      const { data, error } = await supabase
        .from('sets')
        .select('*')
        .eq('user_id', auth.user.id);

      if (error) {
        console.error('Failed to fetch saved sets:', error);
        return;
      }

      set((state) => {
        state.ai.savedSets = data;
      });
    },

    deleteSet: async (setId: string) => {
      const { error } = await supabase.from('sets').delete().eq('id', setId);

      if (error) {
        console.error('Failed to delete set:', error);
        return;
      }

      const { fetchSavedSets } = useDJflyStore.getState().ai;
      fetchSavedSets();
    },
    
    analyzeAudio: async (audioData: ArrayBuffer) => {
      set((state) => {
        state.crowd.isListening = true;
      });

      try {
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(audioData);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const energy = average / 255; // Normalize to 0-1

        const mood = energy > 0.7 ? 'energetic' : energy > 0.4 ? 'excited' : 'chill';
        const engagementLevel = energy > 0.6 ? 'high' : energy > 0.3 ? 'medium' : 'low';

        const newMetrics = {
          currentEnergy: energy,
          mood,
          engagementLevel,
        };

        set((state) => {
          Object.assign(state.crowd, newMetrics);
          state.crowd.isListening = false;
          state.crowd.lastUpdated = new Date();
        });

      } catch (_error) {
        set((state) => {
          state.crowd.isListening = false;
          state.ai.error = _error instanceof Error ? _error.message : 'Audio analysis failed';
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

    setMasterTabId: (tabId) =>
      set((state) => {
        state.ui.masterTabId = tabId;
      }),

    // Auth actions
    setUser: (user) =>
      set((state) => {
        state.auth.user = user;
      }),

    setSession: (session) =>
      set((state) => {
        state.auth.session = session;
      }),
  }))
);

// Selector hooks for easier usage
export const useAuthState = () => useDJflyStore((state) => state.auth);
export const useAudioState = () => useDJflyStore((state) => state.audio);
export const useCrowdState = () => useDJflyStore((state) => state.crowd);
export const useAIState = () => useDJflyStore((state) => state.ai);
export const useSessionState = () => useDJflyStore((state) => state.session);
export const useUIState = () => useDJflyStore((state) => state.ui);

// Action hooks
export const useAuthActions = () => useDJflyStore((state) => ({
  setUser: state.setUser,
  setSession: state.setSession,
}));

export const useAudioActions = () => useDJflyStore((state) => ({
  setTrackForDeck: state.setTrackForDeck,
  setQueue: state.setQueue,
  addToQueue: state.addToQueue,
  removeFromQueue: state.removeFromQueue,
  toggleDeckPlayback: state.toggleDeckPlayback,
  setVolume: state.setVolume,
  updateDeckProgress: state.updateDeckProgress,
  setCrossfader: state.setCrossfader,
}));

export const useCrowdActions = () => useDJflyStore((state) => ({
  startListening: state.startListening,
  stopListening: state.stopListening,
  updateCrowdMetrics: state.updateCrowdMetrics,
}));

export const useAIActions = () => useDJflyStore((state) => ({
  generateSet: state.generateSet,
  analyzeAudio: state.analyzeAudio,
  fetchSavedSets: state.fetchSavedSets,
  deleteSet: state.deleteSet,
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
  setMasterTabId: state.setMasterTabId,
}));
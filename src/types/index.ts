import { User, Session } from '@supabase/supabase-js';

// Core track interface
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  image: string;
  preview_url?: string;
  spotify_url?: string;
  source: 'spotify' | 'youtube' | 'demo';
  
  // Audio features
  bpm?: number;
  key?: string;
  energy?: number;
  valence?: number;
  danceability?: number;
  popularity?: number;
  genre?: string;
}

// Audio state
export interface DeckState {
  track: Track | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export interface AudioState {
  deckA: DeckState;
  deckB: DeckState;
  queue: Track[];
  crossfader: number; // 0 for Deck A, 1 for Deck B
  volume: number;
}

// Crowd analysis state
export interface CrowdState {
  isListening: boolean;
  currentEnergy: number;
  mood: 'excited' | 'chill' | 'energetic' | 'mellow' | 'unknown';
  engagementLevel: 'low' | 'medium' | 'high';
  crowdSize: number;
  averageAge: number;
  energyTrend: 'rising' | 'falling' | 'stable';
  lastUpdated: Date | null;
}

// AI generation state
export interface AIState {
  isGenerating: boolean;
  prompt: string;
  generatedTracks: Track[];
  error: string | null;
  progress: number;
}

// Session state
export interface SessionState {
  sessionId: string;
  startTime: Date | null;
  totalTracks: number;
  averageTrackRating: number;
  setFlow: 'buildup' | 'maintain' | 'cooldown';
  crowdSatisfaction: number;
}

// UI state
export interface UIState {
  currentPage: string;
  showOnboarding: boolean;
  theme: 'dark' | 'light';
  isMobileView: boolean;
  masterTabId: string | null;
}

// Auth state
export interface AuthState {
  user: User | null;
  session: Session | null;
}

// Saved set
export interface SavedSet {
  id: string;
  name: string;
  tracks: Track[];
  created_at: string;
  user_id: string;
}
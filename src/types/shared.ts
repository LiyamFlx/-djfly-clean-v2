// Unified types used everywhere
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  bpm?: number | null;
  key?: string | null;
  preview_url?: string | null;
  album?: string; // needed by api.Track users
  uri?: string; // needed by api.Track users
  genre?: string | null; // some components expect this
  image?: string; // album artwork
  energy?: number; // energy level 0-1
  source?: 'spotify' | 'youtube' | 'demo' | 'local' | 'lastfm';
  spotify_url?: string;
  popularity?: number;
  valence?: number;
  danceability?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  loudness?: number;
  tempo?: number;
  artwork?: string;
  waveform?: Float32Array;
}

export interface AIRecommendation {
  tracks: Track[];
  energy: number; // 0..100
  mood: string; // "morning" | "afternoon" | "evening" | "late-night" | custom
  reasoning?: string;
  mixingTips?: string[];
  nextTrackSuggestions?: Track[];
  energyCurve?: number[];
}

// Minimal AI recommendation for backward compatibility
export interface MinimalAIRecommendation {
  tracks: Track[];
  energy: number;
  mood: string;
}

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'late-night';

export interface AIInsights {
  recommendations?: AIRecommendation[];
  motionDetection?: Record<string, unknown>;
  densityMapping?: Record<string, unknown>;
  demographics?: { label: string; percentage: number }[];
}

export type Analytics = Record<string, unknown>;

// State types for the store
export interface AudioState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  currentTime: number;
  duration: number;
  volume: number;
  crossfadeTime: number;
}

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

export interface AIState {
  isGenerating: boolean;
  prompt: string;
  generatedTracks: Track[];
  error: string | null;
  progress: number;
}

export interface SessionState {
  sessionId: string;
  startTime: Date | null;
  totalTracks: number;
  averageTrackRating: number;
  setFlow: 'buildup' | 'maintain' | 'cooldown';
  crowdSatisfaction: number;
}

export interface UIState {
  currentPage: string;
  showOnboarding: boolean;
  theme: 'dark' | 'light';
  isMobileView: boolean;
}

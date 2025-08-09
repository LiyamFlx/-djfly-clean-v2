<<<<<<< HEAD
// Unified types used everywhere
=======
// Shared types across the application
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
export interface Track {
  id: string;
  title: string;
  artist: string;
<<<<<<< HEAD
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
=======
  duration: number;         // seconds
  bpm?: number | null;
  key?: string | null;
  preview_url?: string | null;
  album?: string;           
  uri?: string;             
  genre?: string | null;    
  image?: string;
  source?: 'spotify' | 'lastfm' | 'demo';
  popularity?: number;      // 0-100
  energy?: number;          // 0-1
  danceability?: number;    // 0-1
  valence?: number;         // 0-1
  acousticness?: number;    // 0-1
  instrumentalness?: number; // 0-1
  liveness?: number;        // 0-1
  speechiness?: number;     // 0-1
  analysis?: AudioAnalysis;
}

export interface AudioAnalysis {
  segments?: AudioSegment[];
  sections?: AudioSection[];
  bars?: AudioBar[];
  beats?: AudioBeat[];
  tatums?: AudioTatum[];
}

export interface AudioSegment {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max_time: number;
  loudness_max: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
}

export interface AudioSection {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
}

export interface AudioBar {
  start: number;
  duration: number;
  confidence: number;
}

export interface AudioBeat {
  start: number;
  duration: number;
  confidence: number;
}

export interface AudioTatum {
  start: number;
  duration: number;
  confidence: number;
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
}

export interface AIRecommendation {
  tracks: Track[];
<<<<<<< HEAD
  energy: number; // 0..100
  mood: string; // "morning" | "afternoon" | "evening" | "late-night" | custom
=======
  energy: number;                 // 0..100
  mood: string;                   
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  reasoning?: string;
  mixingTips?: string[];
  nextTrackSuggestions?: Track[];
  energyCurve?: number[];
}

<<<<<<< HEAD
// Minimal AI recommendation for backward compatibility
export interface MinimalAIRecommendation {
  tracks: Track[];
  energy: number;
  mood: string;
}

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'late-night';
=======
export type DayPart = "morning" | "afternoon" | "evening" | "late-night";
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)

export interface AIInsights {
  recommendations?: AIRecommendation[];
  motionDetection?: Record<string, unknown>;
  densityMapping?: Record<string, unknown>;
  demographics?: { label: string; percentage: number }[];
}

export type Analytics = Record<string, unknown>;

<<<<<<< HEAD
// State types for the store
export interface AudioState {
  isPlaying: boolean;
=======
// Audio Player States
export interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  currentTrack: Track | null;
  queue: Track[];
  currentTime: number;
  duration: number;
  volume: number;
<<<<<<< HEAD
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
=======
  isLoading: boolean;
  error: string | null;
}

// Crowd response and detection
export interface CrowdState {
  energy: number;           // 0-1
  engagement: number;       // 0-1
  mood: string;
  danceFloorDensity: number;
  avgAge: number;
  feedback: string[];
  peakMoments: Array<{
    timestamp: number;
    energy: number;
    track: Track;
  }>;
}

// AI-powered insights and recommendations
export interface AIState {
  insights: AIInsights;
  isAnalyzing: boolean;
  lastUpdate: number;
  recommendations: AIRecommendation[];
  crowdPredictions: {
    nextEnergyLevel: number;
    suggestedGenre: string;
    peakTime: number;
  };
}

// Session management
export interface SessionState {
  id: string;
  startTime: number;
  endTime: number | null;
  venue: string;
  totalTracks: number;
  averageEnergy: number;
  peakEnergy: number;
  crowdSize: number;
  isRecording: boolean;
}

// UI state management
export interface UIState {
  sidebarOpen: boolean;
  currentView: 'player' | 'library' | 'analytics' | 'settings';
  notifications: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: number;
  }>;
  isFullscreen: boolean;
  theme: 'dark' | 'light';
}
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)

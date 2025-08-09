// Shared types across the application
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  bpm?: number | null;
  key?: string | null;
  preview_url?: string | null;
  album?: string;
  uri?: string;
  genre?: string | null;
  image?: string;
  energy?: number; // energy level 0-1
  source?: 'spotify' | 'youtube' | 'demo' | 'local' | 'lastfm';
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  created_at?: string;
  user_id?: string;
  isPublic?: boolean;
  duration?: number; // total duration in seconds
  averageBPM?: number;
  averageEnergy?: number;
}

export interface PlaylistGenerateOptions {
  genre?: string;
  energy?: 'low' | 'medium' | 'high';
  mood?: 'chill' | 'energetic' | 'mixed';
  bpmRange?: [number, number];
  duration?: number; // in minutes
  includePopular?: boolean;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  defaultVolume?: number;
  preferredGenres?: string[];
  crossfadeTime?: number;
  autoPlay?: boolean;
  highQualityAudio?: boolean;
  darkMode?: boolean;
}

export interface AudioState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  crossfadeTime: number;
  isListening: boolean;
}

export interface CrowdState {
  currentEnergy: number;
  mood: 'low' | 'medium' | 'high' | 'mixed';
  engagementLevel: 'low' | 'medium' | 'high';
  dominantGenres: string[];
  bpmPreference: number;
  lastUpdated: Date | null;
}

export interface SessionState {
  id: string | null;
  startTime: Date | null;
  totalTracks: number;
  mixedMinutes: number;
  crowdFeedback: CrowdState | null;
  averageEnergy: number;
  isActive: boolean;
}

// UI Component types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and filtering
export interface SearchFilters {
  query?: string;
  genre?: string;
  bpmRange?: [number, number];
  energyRange?: [number, number];
  durationRange?: [number, number];
  source?: Track['source'][];
}

export interface SearchResult {
  tracks: Track[];
  total: number;
  query: string;
  filters: SearchFilters;
  took: number; // search time in ms
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Service status
export interface ServiceStatus {
  spotify: boolean;
  lastfm: boolean;
  supabase: boolean;
  openai: boolean;
}

export type Theme = 'light' | 'dark';

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
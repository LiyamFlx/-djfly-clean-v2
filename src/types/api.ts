import type { AudioFeatures } from '@/types/audio';

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Spotify API Types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

// OpenAI API Types
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
}

export interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  finish_reason: string;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Supabase Types
export interface SupabaseUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: SupabaseUser;
}

export interface SupabaseError {
  message: string;
  status?: number;
  name?: string;
}

// Music Library Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  bpm?: number;
  key?: string;
  energy?: number;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  loudness?: number;
  tempo?: number;
  uri: string;
  source: 'spotify' | 'local' | 'youtube';
  artwork?: string;
  waveform?: Float32Array;
  features?: AudioFeatures;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
  owner_id: string;
  artwork?: string;
}

export interface Set {
  id: string;
  name: string;
  description?: string;
  tracks: SetTrack[];
  duration: number;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  owner_id: string;
  tags: string[];
  energy_curve?: number[];
  crowd_response?: CrowdResponse[];
}

export interface SetTrack {
  track: Track;
  position: number;
  transition_type: 'fade' | 'cut' | 'beat_match' | 'harmonic';
  transition_duration: number;
  energy_level: number;
  crowd_response?: number;
}

// AI and Analytics Types
export interface CrowdResponse {
  timestamp: number;
  energy: number;
  engagement: number;
  mood: 'positive' | 'neutral' | 'negative';
  movement: number;
}

export interface CrowdContext {
  venue_type: 'club' | 'festival' | 'private' | 'outdoor';
  crowd_size: 'small' | 'medium' | 'large';
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
  genre_preference: string[];
  energy_level: number;
}

export interface MixTransition {
  type: 'fade' | 'cut' | 'beat_match' | 'harmonic';
  duration: number;
  start_time: number;
  end_time: number;
  energy_curve: number[];
}

export interface AIRecommendation {
  track: Track;
  confidence: number;
  reason: string;
  harmonic_match?: boolean;
  energy_match?: boolean;
  crowd_prediction?: number;
}

// Performance and Analytics Types
export interface PerformanceMetrics {
  total_play_time: number;
  tracks_played: number;
  average_energy: number;
  peak_moments: PeakMoment[];
  crowd_engagement: number;
  transitions_count: number;
  harmonic_matches: number;
}

export interface PeakMoment {
  timestamp: number;
  track_id: string;
  energy_level: number;
  crowd_response: number;
  duration: number;
}

export interface AnalyticsData {
  user_id: string;
  session_id: string;
  metrics: PerformanceMetrics;
  tracks_played: string[];
  created_at: string;
}

// Error Types
export interface ApiError {
  type: 'network' | 'auth' | 'rate_limit' | 'server' | 'client';
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Request Types
export interface SearchRequest {
  query: string;
  type: 'track' | 'artist' | 'album' | 'playlist';
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

export interface MixRequest {
  tracks: Track[];
  style: 'smooth' | 'energetic' | 'harmonic' | 'crowd_pleaser';
  duration: number;
  energy_curve?: number[];
  crowd_context?: CrowdContext;
}

export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
  max_tokens?: number;
  temperature?: number;
}

// Response Types
export interface SearchResponse {
  results: Track[];
  total: number;
  has_more: boolean;
}

export interface MixResponse {
  set: Set;
  transitions: MixTransition[];
  energy_curve: number[];
  crowd_predictions: CrowdResponse[];
}

export interface AIResponse {
  content: string;
  recommendations?: AIRecommendation[];
  confidence?: number;
}

<<<<<<< HEAD
export * from './shared';
=======
// Unified types used everywhere
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;         // seconds
  bpm?: number | null;
  key?: string | null;
  preview_url?: string | null;
  album?: string;           // needed by api.Track users
  uri?: string;             // needed by api.Track users
  genre?: string | null;    // some components expect this
}

export interface AIRecommendation {
  tracks: Track[];
  energy: number;                 // 0..100
  mood: string;                   // "morning" | "afternoon" | "evening" | "late-night" | custom
  reasoning?: string;
  mixingTips?: string[];
  nextTrackSuggestions?: Track[];
  energyCurve?: number[];
}

export type DayPart = "morning" | "afternoon" | "evening" | "late-night";

export interface AIInsights {
  recommendations?: AIRecommendation[];
  motionDetection?: Record<string, unknown>;
  densityMapping?: Record<string, unknown>;
  demographics?: { label: string; percentage: number }[];
}

export type Analytics = Record<string, unknown>;
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)

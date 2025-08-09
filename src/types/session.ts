<<<<<<< HEAD
// Enhanced Session Management Types
export type EnergyPoint = { t: number; value: number };

export type SessionStatus =
  | 'IDLE'
  | 'SETUP'
  | 'STUDIO_SET_READY'
  | 'STUDIO_MATCHING'
  | 'STUDIO_EDITING'
  | 'LIVE'
  | 'LIVE_PAUSED'
  | 'LIVE_RECOVERING'
  | 'ANALYTICS_READY'
  | 'ARCHIVED';

export interface CrowdDemographics {
  ageRange: [number, number];
  genderDistribution: { male: number; female: number; other: number };
  energyPreference: 'high' | 'medium' | 'low';
}

export interface VenueAcoustics {
  roomSize: 'small' | 'medium' | 'large';
  acousticType: 'live' | 'dead' | 'balanced';
  soundSystem: 'basic' | 'professional' | 'club-grade';
}

export interface PerformanceMetrics {
  targetDuration: number;
  energyCurve: EnergyPoint[];
  transitionPoints: number[];
}
=======
// Session and context types for MagicSet
import type { Track } from './shared';
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)

export interface SessionContext {
  venue?: string;
  crowdSize?: number;
  vibe?: string;
<<<<<<< HEAD
  bpmTarget?: [number, number];
  genres?: string[];
  notes?: string;
  // Enhanced context
  crowdDemographics?: CrowdDemographics;
  venueAcoustics?: VenueAcoustics;
  performanceMetrics?: PerformanceMetrics;
=======
  genres?: string[];
  bpmTarget?: [number, number];  // [min, max]
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  duration?: number;             // Expected set duration in minutes
  specialRequests?: string[];
  energyProfile?: 'build' | 'maintain' | 'decline';
}

export interface EnergyPoint {
  t: number;    // Time in seconds
  value: number; // Energy level 0-1
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
}

export interface Session {
  id: string;
  user_id: string;
<<<<<<< HEAD
  status: SessionStatus;
  context: SessionContext;
  set_id?: string;
  active_track_id?: string;
  energy_curve: EnergyPoint[];
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
  // Enhanced fields
  collaborators?: string[];
  realtime_channel?: string;
  recovery_data?: {
    last_state: SessionStatus;
    last_track_id?: string;
    last_position?: number;
  };
}

// Session State Machine Transitions
export type SessionTransition =
  | 'CREATE'
  | 'START_SETUP'
  | 'SETUP_COMPLETE'
  | 'ENTER_STUDIO'
  | 'SET_READY'
  | 'START_MATCHING'
  | 'MATCHING_COMPLETE'
  | 'START_EDITING'
  | 'EDITING_COMPLETE'
  | 'GO_LIVE'
  | 'PAUSE_LIVE'
  | 'RESUME_LIVE'
  | 'RECOVER_LIVE'
  | 'END_SESSION'
  | 'GENERATE_ANALYTICS'
  | 'ARCHIVE';

// Session Events for Analytics
export type SessionEventType =
  | 'SESSION_CREATED'
  | 'SESSION_STARTED'
  | 'TRACK_PLAYED'
  | 'TRACK_PAUSED'
  | 'TRACK_SWITCHED'
  | 'CROWD_REACT'
  | 'FX_TOGGLE'
  | 'MATCH_APPLIED'
  | 'TRANSITION'
  | 'ERROR'
  | 'SESSION_ENDED';

export interface SessionEvent {
  id: string;
  session_id: string;
  user_id: string;
  type: SessionEventType;
  payload: {
    track_id?: string;
    timestamp: number;
=======
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'ANALYTICS_READY';
  context: SessionContext;
  energy_curve: EnergyPoint[];
  created_at: string;
  updated_at: string;
}

export interface SessionEvent {
  id: string;
  session_id: string;
  type: 'TRACK_PLAYED' | 'TRACK_SKIPPED' | 'TRANSITION' | 'CROWD_REACT' | 'ERROR' | 'ENERGY_CHANGE';
  timestamp: number;
  payload: {
    track_id?: string;
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
    energy_level?: number;
    crowd_response?: {
      energy: number;
      engagement: number;
      mood: string;
    };
    transition_quality?: number;
<<<<<<< HEAD
    error_details?: string;
  };
  metadata: {
    device_info: string;
    network_quality: number;
    audio_latency: number;
=======
    error_message?: string;
    [key: string]: any;
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  };
  created_at: string;
}

<<<<<<< HEAD
// Session Recovery Interface
export interface SessionRecovery {
  session_id: string;
  last_status: SessionStatus;
  last_track_id?: string;
  last_position?: number;
  energy_curve: EnergyPoint[];
  context: SessionContext;
  recovery_timestamp: string;
}

// Real-time Session Updates
export interface SessionUpdate {
  session_id: string;
  status: SessionStatus;
  active_track_id?: string;
  current_position?: number;
  energy_level: number;
  crowd_response?: {
    energy: number;
    engagement: number;
    mood: string;
  };
  timestamp: string;
}

// Session Analytics Summary
export interface SessionAnalytics {
=======
export interface SetMetrics {
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  session_id: string;
  total_duration: number;
  tracks_played: number;
  average_energy: number;
  peak_energy: number;
<<<<<<< HEAD
  crowd_satisfaction: number;
  transition_count: number;
  error_count: number;
  generated_at: string;
}
=======
  energy_variance: number;
  transition_quality: number;
  crowd_satisfaction: number;
  genre_distribution: Record<string, number>;
  bpm_range: [number, number];
  key_distribution: Record<string, number>;
  artist_diversity: number;
  calculated_at: string;
}

export interface SetInsights {
  session_id: string;
  energy_flow_analysis: {
    flow_quality: 'excellent' | 'good' | 'fair' | 'poor';
    smooth_transitions: number;
    jarring_transitions: number;
    energy_peaks: Array<{
      timestamp: number;
      value: number;
      track_id?: string;
    }>;
    energy_valleys: Array<{
      timestamp: number;
      value: number;
      track_id?: string;
    }>;
  };
  track_selection_analysis: {
    variety_score: number;
    genre_coherence: number;
    bpm_consistency: number;
    key_harmony_score: number;
    crowd_appeal_avg: number;
  };
  crowd_response_analysis: {
    peak_moments: Array<{
      timestamp: number;
      track_id: string;
      crowd_energy: number;
      response_type: string;
    }>;
    low_energy_periods: Array<{
      timestamp: number;
      duration: number;
      possible_causes: string[];
    }>;
    overall_satisfaction: number;
    engagement_curve: Array<{
      timestamp: number;
      engagement: number;
    }>;
  };
  recommendations: {
    next_session_improvements: string[];
    track_suggestions: Array<{
      track: Track;
      reasoning: string;
      confidence: number;
    }>;
    energy_curve_suggestions: string[];
    technical_improvements: string[];
  };
  performanceScore: number; // 0-1
  generated_at: string;
}
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)

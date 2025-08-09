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

export interface SessionContext {
  venue?: string;
  crowdSize?: number;
  vibe?: string;
  bpmTarget?: [number, number];
  genres?: string[];
  notes?: string;
  // Enhanced context
  crowdDemographics?: CrowdDemographics;
  venueAcoustics?: VenueAcoustics;
  performanceMetrics?: PerformanceMetrics;
}

export interface Session {
  id: string;
  user_id: string;
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
    energy_level?: number;
    crowd_response?: {
      energy: number;
      engagement: number;
      mood: string;
    };
    transition_quality?: number;
    error_details?: string;
  };
  metadata: {
    device_info: string;
    network_quality: number;
    audio_latency: number;
  };
  created_at: string;
}

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
  session_id: string;
  total_duration: number;
  tracks_played: number;
  average_energy: number;
  peak_energy: number;
  crowd_satisfaction: number;
  transition_count: number;
  error_count: number;
  generated_at: string;
}

export interface SessionContext {
  venue?: string;
  crowdSize?: number;
  vibe?: string;
  bpmTarget?: number;
  genres?: string[];
}

export type SessionStatus = 'idle' | 'active' | 'paused' | 'ended';

export interface SessionTransition {
  from: SessionStatus;
  to: SessionStatus;
  timestamp: Date;
  reason?: string;
}

export interface SessionUpdate {
  session_id: string;
  updates: Partial<Session>;
  timestamp: Date;
}

export interface SessionRecovery {
  session_id: string;
  recovery_point: Date;
  state_snapshot: any;
}

export interface EnergyPoint {
  timestamp: Date;
  value: number;
  track_id?: string;
}

export interface CrowdResponse {
  energy: number;
  engagement: number;
  mood: string;
}

export interface SessionMetrics {
  energy_level?: number;
  crowd_response?: CrowdResponse;
  transition_quality?: number;
}

export interface Session {
  id: string;
  user_id: string;
  metrics?: SessionMetrics;
  created_at: string;
  status?: SessionStatus;
  started_at?: string;
  ended_at?: string;
  active_track_id?: string;
  energy_curve?: EnergyPoint[];
  context?: SessionContext;
  realtime_channel?: string;
}

export interface SessionAnalytics {
  session_id: string;
  total_duration: number;
  tracks_played: number;
  average_energy: number;
  peak_energy: number;
  crowd_engagement: number;
  track_transitions: number;
  successful_transitions: number;
}

export interface SessionSummary {
  session: Session;
  analytics: SessionAnalytics;
  highlights: string[];
  recommendations: string[];
}
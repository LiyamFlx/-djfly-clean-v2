
export interface SessionContext {
  venue?: string;
  crowdSize?: number;
  vibe?: string;
}

export interface Session {
  id: string;
  user_id: string;
    energy_level?: number;
    crowd_response?: {
      energy: number;
      engagement: number;
      mood: string;
    };
    transition_quality?: number;
  };
  created_at: string;
}

  session_id: string;
  total_duration: number;
  tracks_played: number;
  average_energy: number;
  peak_energy: number;

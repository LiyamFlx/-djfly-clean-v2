export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
        };
      };
      tracks: {
        Row: {
          id: string;
          title: string;
          artist: string;
          image_url: string | null;
          preview_url: string | null;
          duration_ms: number | null;
          bpm: number | null;
          energy: number | null;
          valence: number | null;
          danceability: number | null;
          musical_key: number | null;
          popularity: number;
          spotify_url: string | null;
          source: string;
        };
        Insert: {
          id: string;
          title: string;
          artist: string;
          image_url?: string | null;
          preview_url?: string | null;
          duration_ms?: number | null;
          bpm?: number | null;
          energy?: number | null;
          valence?: number | null;
          danceability?: number | null;
          musical_key?: number | null;
          popularity?: number;
          spotify_url?: string | null;
          source?: string;
        };
        Update: Partial<Database['public']['Tables']['tracks']['Insert']>;
      };
      sets: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          genre: string | null;
          total_duration_ms: number;
          average_bpm: number | null;
          is_public: boolean;
          play_count: number;
          like_count: number;
          tags: string[] | null;
        };
        Insert: {
          user_id: string;
          name: string;
          description?: string | null;
          genre?: string | null;
          is_public?: boolean;
          tags?: string[] | null;
        };
        Update: Partial<Database['public']['Tables']['sets']['Insert']>;
      };
      set_tracks: {
        Row: {
          set_id: number;
          track_id: string;
          track_order: number;
        };
        Insert: {
          set_id: number;
          track_id: string;
          track_order: number;
        };
        Update: Partial<Database['public']['Tables']['set_tracks']['Insert']>;
      };
      magic_match_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_name: string | null;
          analysis_result: Json | null;
          recommended_tracks: string[] | null;
          created_at: string;
          venue_name: string | null;
          crowd_size: number | null;
        };
        Insert: {
          user_id: string;
          session_name?: string | null;
          analysis_result?: Json | null;
          recommended_tracks?: string[] | null;
          venue_name?: string | null;
          crowd_size?: number | null;
        };
        Update: Partial<Database['public']['Tables']['magic_match_sessions']['Insert']>;
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          generation_type: 'magic_set' | 'magic_match' | 'transition_advice';
          prompt_text: string | null;
          input_data: Json | null;
          output_data: Json | null;
          generated_tracks: string[] | null;
          created_at: string;
          model_used: string | null;
        };
        Insert: {
          user_id: string;
          generation_type: 'magic_set' | 'magic_match' | 'transition_advice';
          prompt_text?: string | null;
          input_data?: Json | null;
          output_data?: Json | null;
          generated_tracks?: string[] | null;
          model_used?: string | null;
        };
        Update: Partial<Database['public']['Tables']['ai_generations']['Insert']>;
      };
    };
    Views: {
      popular_sets: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          creator_username: string;
          track_count: number;
          play_count: number;
          like_count: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

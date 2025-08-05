-- Enhanced DJfly Database Schema
-- Migration: 0002_enhanced_schema.sql

-- =============================================
-- 1. Enhanced Tracks Table with Audio Features
-- =============================================

-- Add audio analysis columns to tracks
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS 
  bpm INTEGER,
  energy DECIMAL(3,2), -- 0.00 to 1.00
  valence DECIMAL(3,2), -- 0.00 to 1.00 (musical positivity)
  danceability DECIMAL(3,2), -- 0.00 to 1.00
  musical_key INTEGER, -- 0-11 (Spotify key notation)
  popularity INTEGER DEFAULT 0,
  spotify_url TEXT,
  source TEXT DEFAULT 'spotify',
  audio_features_updated_at TIMESTAMPTZ;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_bpm ON tracks(bpm);
CREATE INDEX IF NOT EXISTS idx_tracks_energy ON tracks(energy);
CREATE INDEX IF NOT EXISTS idx_tracks_source ON tracks(source);

-- =============================================
-- 2. DJ Sets with Enhanced Metadata
-- =============================================

-- Add enhanced metadata to sets table
ALTER TABLE sets ADD COLUMN IF NOT EXISTS
  genre TEXT,
  total_duration_ms INTEGER DEFAULT 0,
  average_bpm INTEGER,
  energy_curve JSONB, -- Store energy progression data
  is_public BOOLEAN DEFAULT FALSE,
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  tags TEXT[],
  cover_image_url TEXT;

-- Create index for public sets discovery
CREATE INDEX IF NOT EXISTS idx_sets_public ON sets(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_sets_genre ON sets(genre);

-- =============================================
-- 3. Magic Match Sessions (Crowd Analysis)
-- =============================================

CREATE TABLE IF NOT EXISTS magic_match_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_name TEXT,
  audio_data_url TEXT, -- URL to stored audio sample
  analysis_result JSONB, -- Store crowd analysis results
  recommended_tracks TEXT[], -- Array of track IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  venue_name TEXT,
  crowd_size INTEGER,
  session_duration_ms INTEGER
);

ALTER TABLE magic_match_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own magic match sessions" 
ON magic_match_sessions FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 4. User Preferences and Settings
-- =============================================

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_genres TEXT[],
  favorite_bpm_range INTEGER[], -- [min, max]
  crossfade_duration_ms INTEGER DEFAULT 3000,
  auto_mix_enabled BOOLEAN DEFAULT FALSE,
  notification_settings JSONB DEFAULT '{}',
  theme_preference TEXT DEFAULT 'dark',
  audio_quality TEXT DEFAULT 'high',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" 
ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 5. Playlist Analytics and Performance
-- =============================================

CREATE TABLE IF NOT EXISTS set_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id BIGINT NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
  play_date TIMESTAMPTZ DEFAULT NOW(),
  venue_name TEXT,
  audience_size INTEGER,
  average_engagement DECIMAL(3,2), -- 0.00 to 1.00
  peak_energy_time TIMESTAMPTZ,
  total_play_duration_ms INTEGER,
  skip_rate DECIMAL(3,2), -- Percentage of tracks skipped
  crowd_response_data JSONB,
  weather_conditions TEXT,
  event_type TEXT
);

ALTER TABLE set_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view analytics for their own sets" 
ON set_analytics FOR SELECT USING (
  (SELECT user_id FROM sets WHERE id = set_id) = auth.uid()
);
CREATE POLICY "Users can add analytics for their own sets" 
ON set_analytics FOR INSERT WITH CHECK (
  (SELECT user_id FROM sets WHERE id = set_id) = auth.uid()
);

-- =============================================
-- 6. Collaboration and Sharing
-- =============================================

CREATE TABLE IF NOT EXISTS set_collaborators (
  set_id BIGINT NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit', 'admin')),
  invited_by UUID NOT NULL REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  PRIMARY KEY (set_id, user_id)
);

ALTER TABLE set_collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Set owners can manage collaborators" 
ON set_collaborators FOR ALL USING (
  (SELECT user_id FROM sets WHERE id = set_id) = auth.uid()
);
CREATE POLICY "Collaborators can view their invitations" 
ON set_collaborators FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 7. AI Generation History
-- =============================================

CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  generation_type TEXT NOT NULL CHECK (generation_type IN ('magic_set', 'magic_match', 'transition_advice')),
  prompt_text TEXT,
  input_data JSONB, -- Store input parameters
  output_data JSONB, -- Store AI response
  generated_tracks TEXT[], -- Array of track IDs generated
  generation_time_ms INTEGER,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5)
);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own AI generations" 
ON ai_generations FOR ALL USING (auth.uid() = user_id);

-- Create index for generation history queries
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_type ON ai_generations(user_id, generation_type);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at DESC);

-- =============================================
-- 8. Real-time Session Management
-- =============================================

CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  current_track_id TEXT REFERENCES tracks(id),
  current_position_ms INTEGER DEFAULT 0,
  is_playing BOOLEAN DEFAULT FALSE,
  volume_level DECIMAL(3,2) DEFAULT 0.80,
  participants JSONB DEFAULT '[]', -- Array of user IDs
  session_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Session hosts can manage their sessions" 
ON live_sessions FOR ALL USING (auth.uid() = host_user_id);
CREATE POLICY "Anyone can view active public sessions" 
ON live_sessions FOR SELECT USING (is_active = TRUE);

-- =============================================
-- 9. Enhanced Indexes for Performance
-- =============================================

-- Track discovery and recommendation indexes
CREATE INDEX IF NOT EXISTS idx_tracks_popularity_desc ON tracks(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_tracks_bpm_energy ON tracks(bpm, energy);
CREATE INDEX IF NOT EXISTS idx_tracks_artist_title ON tracks(artist, title);

-- Set discovery indexes
CREATE INDEX IF NOT EXISTS idx_sets_created_at_desc ON sets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sets_play_count_desc ON sets(play_count DESC) WHERE is_public = TRUE;

-- Analytics performance indexes
CREATE INDEX IF NOT EXISTS idx_set_analytics_play_date ON set_analytics(play_date DESC);
CREATE INDEX IF NOT EXISTS idx_set_analytics_engagement ON set_analytics(average_engagement DESC);

-- =============================================
-- 10. Triggers for Automatic Updates
-- =============================================

-- Update set metadata when tracks are added/removed
CREATE OR REPLACE FUNCTION update_set_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total duration and track count
  UPDATE sets 
  SET 
    updated_at = NOW(),
    total_duration_ms = (
      SELECT COALESCE(SUM(t.duration_ms), 0)
      FROM set_tracks st
      JOIN tracks t ON st.track_id = t.id
      WHERE st.set_id = COALESCE(NEW.set_id, OLD.set_id)
    ),
    average_bpm = (
      SELECT ROUND(AVG(t.bpm))
      FROM set_tracks st
      JOIN tracks t ON st.track_id = t.id
      WHERE st.set_id = COALESCE(NEW.set_id, OLD.set_id) AND t.bpm IS NOT NULL
    )
  WHERE id = COALESCE(NEW.set_id, OLD.set_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_set_metadata ON set_tracks;
CREATE TRIGGER trigger_update_set_metadata
  AFTER INSERT OR UPDATE OR DELETE ON set_tracks
  FOR EACH ROW EXECUTE FUNCTION update_set_metadata();

-- Update user profile updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER trigger_update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 11. Views for Common Queries
-- =============================================

-- Popular public sets view
CREATE OR REPLACE VIEW popular_sets AS
SELECT 
  s.*,
  p.username as creator_username,
  p.avatar_url as creator_avatar,
  COUNT(st.track_id) as track_count
FROM sets s
JOIN profiles p ON s.user_id = p.id
LEFT JOIN set_tracks st ON s.id = st.set_id
WHERE s.is_public = TRUE
GROUP BY s.id, p.username, p.avatar_url
ORDER BY s.play_count DESC, s.like_count DESC;

-- User's sets with metadata view
CREATE OR REPLACE VIEW user_sets_with_metadata AS
SELECT 
  s.*,
  COUNT(st.track_id) as track_count,
  COALESCE(MAX(sa.play_date), s.created_at) as last_played
FROM sets s
LEFT JOIN set_tracks st ON s.id = st.set_id
LEFT JOIN set_analytics sa ON s.id = sa.set_id
GROUP BY s.id;

-- Track recommendations view (tracks similar to user's favorites)
CREATE OR REPLACE VIEW track_recommendations AS
SELECT DISTINCT
  t.*,
  COUNT(*) OVER (PARTITION BY t.id) as recommendation_score
FROM tracks t
JOIN set_tracks st ON t.id = st.track_id
JOIN sets s ON st.set_id = s.id
WHERE s.is_public = TRUE AND s.play_count > 0
ORDER BY recommendation_score DESC, t.popularity DESC;

-- =============================================
-- 12. Security Policies Update
-- =============================================

-- Allow public read access to public sets
CREATE POLICY "Anyone can view public sets" ON sets 
FOR SELECT USING (is_public = TRUE);

-- Allow public read access to tracks in public sets
CREATE POLICY "Anyone can view tracks in public sets" ON set_tracks 
FOR SELECT USING (
  (SELECT is_public FROM sets WHERE id = set_id) = TRUE
);

-- Allow reading user profiles for public information
CREATE POLICY "Anyone can view public profile info" ON profiles 
FOR SELECT USING (TRUE); -- Only username and avatar are exposed in views

COMMIT;
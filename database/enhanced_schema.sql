-- Enhanced DJfly Database Schema
-- Supports all advanced features: sessions, tracks, analytics, real-time data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'IDLE', 'SETUP', 'STUDIO_SET_READY', 'STUDIO_MATCHING', 
        'STUDIO_EDITING', 'LIVE', 'LIVE_PAUSED', 'LIVE_RECOVERING', 
        'ANALYTICS_READY', 'ARCHIVED'
    )),
    context JSONB NOT NULL DEFAULT '{}',
    set_id TEXT,
    active_track_id TEXT,
    energy_curve JSONB DEFAULT '[]',
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    collaborators TEXT[] DEFAULT '{}',
    realtime_channel TEXT,
    recovery_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sets table
CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    bpm_range INTEGER[],
    key_center TEXT,
    energy_curve JSONB DEFAULT '[]',
    tracks_order TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration INTEGER NOT NULL,
    image TEXT,
    preview_url TEXT,
    spotify_url TEXT,
    source TEXT NOT NULL CHECK (source IN ('spotify', 'youtube', 'demo', 'upload')),
    
    -- Audio features
    bpm INTEGER,
    key TEXT,
    energy REAL,
    valence REAL,
    danceability REAL,
    popularity INTEGER,
    genre TEXT,
    
    -- Advanced analysis
    analysis JSONB DEFAULT '{}',
    
    -- DJ-specific features
    hot_cues JSONB DEFAULT '[]',
    loops JSONB DEFAULT '[]',
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    play_count INTEGER DEFAULT 0,
    last_played TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Magic matches table
CREATE TABLE IF NOT EXISTS magic_matches (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    base_track_id TEXT REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
    candidate_track_id TEXT REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
    score REAL NOT NULL CHECK (score >= 0 AND score <= 1),
    rationale JSONB NOT NULL DEFAULT '{}',
    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session events table
CREATE TABLE IF NOT EXISTS session_events (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'SESSION_CREATED', 'SESSION_STARTED', 'TRACK_PLAYED', 'TRACK_PAUSED',
        'TRACK_SWITCHED', 'CROWD_REACT', 'FX_TOGGLE', 'MATCH_APPLIED',
        'TRANSITION', 'ERROR', 'SESSION_ENDED'
    )),
    payload JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session recoveries table
CREATE TABLE IF NOT EXISTS session_recoveries (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    last_status TEXT NOT NULL,
    last_track_id TEXT,
    last_position INTEGER,
    energy_curve JSONB DEFAULT '[]',
    context JSONB NOT NULL DEFAULT '{}',
    recovery_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Producer reports table
CREATE TABLE IF NOT EXISTS producer_reports (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    summary JSONB NOT NULL DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    crowd_insights JSONB NOT NULL DEFAULT '{}',
    performance_metrics JSONB NOT NULL DEFAULT '{}',
    exports JSONB NOT NULL DEFAULT '{}',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crowd response data table
CREATE TABLE IF NOT EXISTS crowd_responses (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    energy REAL NOT NULL CHECK (energy >= 0 AND energy <= 1),
    engagement REAL NOT NULL CHECK (engagement >= 0 AND engagement <= 1),
    mood TEXT NOT NULL,
    demographics JSONB NOT NULL DEFAULT '{}',
    behavior JSONB NOT NULL DEFAULT '{}',
    predictions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time session updates table
CREATE TABLE IF NOT EXISTS session_updates (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    active_track_id TEXT,
    current_position INTEGER,
    energy_level REAL NOT NULL CHECK (energy_level >= 0 AND energy_level <= 1),
    crowd_response JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration invites table
CREATE TABLE IF NOT EXISTS collaboration_invites (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    inviter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    invitee_email TEXT NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
    audio_settings JSONB NOT NULL DEFAULT '{}',
    ui_settings JSONB NOT NULL DEFAULT '{}',
    performance_settings JSONB NOT NULL DEFAULT '{}',
    privacy_settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_tracks_user_id ON tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_bpm ON tracks(bpm);
CREATE INDEX IF NOT EXISTS idx_tracks_energy ON tracks(energy);

CREATE INDEX IF NOT EXISTS idx_session_events_session_id ON session_events(session_id);
CREATE INDEX IF NOT EXISTS idx_session_events_type ON session_events(type);
CREATE INDEX IF NOT EXISTS idx_session_events_created_at ON session_events(created_at);

CREATE INDEX IF NOT EXISTS idx_magic_matches_base_track ON magic_matches(base_track_id);
CREATE INDEX IF NOT EXISTS idx_magic_matches_score ON magic_matches(score);

CREATE INDEX IF NOT EXISTS idx_crowd_responses_session_id ON crowd_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_crowd_responses_created_at ON crowd_responses(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_recoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Sessions policies
CREATE POLICY "Users can manage own sessions" ON sessions
    FOR ALL USING (auth.uid() = user_id);

-- Sets policies
CREATE POLICY "Users can manage own sets" ON sets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public sets" ON sets
    FOR SELECT USING (is_public = true);

-- Tracks policies
CREATE POLICY "Users can manage own tracks" ON tracks
    FOR ALL USING (auth.uid() = user_id);

-- Magic matches policies
CREATE POLICY "Users can manage own matches" ON magic_matches
    FOR ALL USING (auth.uid() = user_id);

-- Session events policies
CREATE POLICY "Users can manage own session events" ON session_events
    FOR ALL USING (auth.uid() = user_id);

-- Session recoveries policies
CREATE POLICY "Users can manage own session recoveries" ON session_recoveries
    FOR ALL USING (EXISTS (
        SELECT 1 FROM sessions WHERE sessions.id = session_recoveries.session_id AND sessions.user_id = auth.uid()
    ));

-- Producer reports policies
CREATE POLICY "Users can manage own reports" ON producer_reports
    FOR ALL USING (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can manage own analytics events" ON analytics_events
    FOR ALL USING (auth.uid() = user_id);

-- Crowd responses policies
CREATE POLICY "Users can manage own crowd responses" ON crowd_responses
    FOR ALL USING (EXISTS (
        SELECT 1 FROM sessions WHERE sessions.id = crowd_responses.session_id AND sessions.user_id = auth.uid()
    ));

-- Session updates policies
CREATE POLICY "Users can manage own session updates" ON session_updates
    FOR ALL USING (EXISTS (
        SELECT 1 FROM sessions WHERE sessions.id = session_updates.session_id AND sessions.user_id = auth.uid()
    ));

-- Collaboration invites policies
CREATE POLICY "Users can manage own invites" ON collaboration_invites
    FOR ALL USING (auth.uid() = inviter_id);

CREATE POLICY "Users can view invites for them" ON collaboration_invites
    FOR SELECT USING (invitee_email = (SELECT email FROM users WHERE id = auth.uid()));

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sets_updated_at BEFORE UPDATE ON sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update play count
CREATE OR REPLACE FUNCTION increment_play_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tracks 
    SET play_count = play_count + 1, last_played = NOW()
    WHERE id = NEW.payload->>'track_id';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment play count
CREATE TRIGGER on_track_played
    AFTER INSERT ON session_events
    FOR EACH ROW
    WHEN (NEW.type = 'TRACK_PLAYED')
    EXECUTE FUNCTION increment_play_count();

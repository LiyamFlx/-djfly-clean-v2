-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Sets Table
CREATE TABLE sets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW() -- Added per your suggestion
);
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sets" ON sets FOR ALL USING (auth.uid() = user_id);

-- 3. Tracks Table
CREATE TABLE tracks (
  id TEXT PRIMARY KEY, -- Spotify ID
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  image_url TEXT,
  preview_url TEXT,
  duration_ms INTEGER
);
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
-- For now, allow any authenticated user to add/read tracks to/from the global catalog.
CREATE POLICY "Authenticated users can manage tracks" ON tracks FOR ALL USING (auth.role() = 'authenticated');

-- 4. Set_Tracks Junction Table
CREATE TABLE set_tracks (
  set_id BIGINT NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  track_order INTEGER NOT NULL,
  PRIMARY KEY (set_id, track_id)
);
ALTER TABLE set_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage tracks in their own sets" ON set_tracks FOR ALL USING (
  (SELECT user_id FROM sets WHERE id = set_id) = auth.uid()
);

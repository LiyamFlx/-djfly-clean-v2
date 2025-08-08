# API Credentials Setup Guide

## 🔑 Setting Up Real API Credentials

Create a `.env` file in your project root with the following structure:

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Spotify Configuration
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
VITE_SPOTIFY_REDIRECT_URI=https://djfly-clean-v2.vercel.app/auth/spotify/callback

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# YouTube Configuration
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Last.fm Configuration
VITE_LASTFM_API_KEY=your_lastfm_api_key_here
VITE_LASTFM_SECRET=your_lastfm_secret_here

# Google Studio Configuration
VITE_GOOGLE_STUDIO_API_KEY=your_google_studio_api_key_here

# App Configuration
VITE_APP_ENVIRONMENT=production
VITE_APP_NAME=DJfly Clean
VITE_APP_VERSION=1.2.0

# Feature Flags
VITE_MAGIC_MATCH_ENABLED=true
VITE_MAGIC_SET_ENABLED=true
VITE_ANALYTICS_ENABLED=true

# Security Settings
VITE_SESSION_TIMEOUT=60
VITE_MAX_LOGIN_ATTEMPTS=5

# Audio Configuration
VITE_AUDIO_SAMPLE_RATE=44100
VITE_AUDIO_BUFFER_SIZE=2048
VITE_PLAYER_CROSSFADE_DURATION=3000
VITE_PLAYER_MAX_VOLUME=90
```

## 🚀 Setup Instructions

### 1. Create .env file
```bash
# In your project root directory
touch .env
```

### 2. Add your real credentials
Replace the placeholder values with your actual API credentials.

### 3. Restart the development server
```bash
# Stop the current server (Ctrl+C)
# Then restart
pnpm dev
```

## 🔒 Security Notes

- ✅ Real API credentials are required for full functionality
- ✅ The secure configuration will validate them
- ✅ No more demo/placeholder credentials
- ✅ All API services will work properly with real credentials

## 🧪 Testing After Setup

After adding real credentials:

1. **Check Console**: Should see fewer errors
2. **Test Spotify**: Music search should work
3. **Test OpenAI**: AI features should work
4. **Test Supabase**: Database features should work
5. **Test Authentication**: Login/signup should work with real backend

## 📊 Expected Changes

**Before (with demo credentials):**
- ❌ Supabase 404 errors
- ❌ Spotify 400 errors  
- ❌ OpenAI 401 errors
- ❌ Limited functionality

**After (with real credentials):**
- ✅ Successful API connections
- ✅ Full functionality
- ✅ Real data from services
- ✅ Working authentication

## 🛡️ Security Improvements Active

With real credentials, you'll also benefit from:
- ✅ Secure token storage
- ✅ Input validation
- ✅ Rate limiting
- ✅ Error sanitization
- ✅ Password strength validation
- ✅ CSRF protection
- ✅ XSS prevention

## 🔐 Important Security Reminders

1. **Never commit .env files** - They're already in .gitignore
2. **Use environment variables** - Don't hardcode credentials
3. **Rotate credentials regularly** - Keep API keys secure
4. **Monitor usage** - Watch for unusual API activity
5. **Use secure storage** - Credentials are stored securely in sessionStorage

## 📋 Required Services

To get full functionality, you'll need:

1. **OpenAI API Key** - For AI features
2. **Spotify API Credentials** - For music search
3. **Supabase Project** - For database and authentication
4. **YouTube API Key** - For video content
5. **Last.fm API Key** - For music metadata
6. **Google Studio API Key** - For additional features

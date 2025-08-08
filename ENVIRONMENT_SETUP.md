# Environment Setup Guide

This guide will help you set up the required environment variables to resolve the authentication and API issues.

## 🔧 Required Environment Variables

Create a `.env` file in your project root with the following variables:

### 1. **Supabase Configuration**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get these:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### 2. **Spotify API Configuration**
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/auth/spotify/callback
```

**How to get these:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:5173/auth/spotify/callback` to Redirect URIs
4. Copy the Client ID and Client Secret

### 3. **OpenAI API Configuration**
```env
VITE_OPENAI_API_KEY=your_openai_api_key
```

**How to get this:**
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key

### 4. **Optional APIs**
```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_LASTFM_API_KEY=your_lastfm_api_key
VITE_LASTFM_SECRET=your_lastfm_secret
```

## 🚀 Quick Setup for Development

If you want to test the app without setting up all APIs, you can use these demo values:

```env
# Required for basic functionality
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional - app will use fallbacks if not set
VITE_SPOTIFY_CLIENT_ID=demo_client_id
VITE_SPOTIFY_CLIENT_SECRET=demo_client_secret
VITE_OPENAI_API_KEY=demo_openai_key
```

## 🔍 Database Setup

Make sure your Supabase database has the correct schema. Run the enhanced schema:

```sql
-- Run the enhanced schema from database/enhanced_schema.sql
```

## 🛠️ Troubleshooting

### Spotify Authentication Issues
- **Error**: "Spotify not connected. Please authenticate first."
- **Solution**: The app now includes demo tracks as fallback. Set up Spotify credentials for full functionality.

### Database Connection Issues
- **Error**: "invalid input syntax for type bigint"
- **Solution**: Make sure you're using the enhanced schema with UUID fields.

### OpenAI API Issues
- **Error**: "401 Unauthorized"
- **Solution**: Set up a valid OpenAI API key or the app will use fallback AI responses.

## 📝 Current Status

✅ **Fixed Issues:**
- Database schema compatibility (UUID vs bigint)
- Spotify authentication fallback with demo tracks
- OpenAI API fallback with mock responses
- TypeScript compilation errors

⚠️ **Remaining Issues:**
- Test failures due to MagicPlayer implementation changes
- Some linter warnings about `any` types (non-critical)

## 🎯 Next Steps

1. **Set up environment variables** using the guide above
2. **Deploy the enhanced schema** to your Supabase database
3. **Test the application** - it should now work with fallbacks
4. **Configure real API keys** for full functionality

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 📞 Support

If you encounter any issues:
1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the database schema is properly deployed
4. The app will gracefully fall back to demo data if APIs are unavailable

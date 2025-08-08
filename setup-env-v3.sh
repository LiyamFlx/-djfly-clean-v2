#!/bin/bash

echo "🔧 Setting up Environment Variables for DJfly Clean v3"
echo "====================================================="

# Add all environment variables
echo "Adding environment variables..."

echo "VITE_SPOTIFY_CLIENT_ID=d9fcdf37e5bf45248b401a25a2774aec" | vercel env add VITE_SPOTIFY_CLIENT_ID production
echo "VITE_SPOTIFY_CLIENT_SECRET=a92d4508d3fb4697b5be10401b70944a" | vercel env add VITE_SPOTIFY_CLIENT_SECRET production
echo "https://djfly-clean-v3-feo5o1l96-liyams-projects.vercel.app/auth/spotify/callback" | vercel env add VITE_SPOTIFY_REDIRECT_URI production
echo "https://rwrmwymefgpfuztdtqbw.supabase.co" | vercel env add VITE_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cm13eW1lZmdwZnV6dGR0cWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTYyODMsImV4cCI6MjA2ODUzMjI4M30.K-Tl2U4S00DoZyb5uxej57t3tmNuB29rpLTSUUtYPAc" | vercel env add VITE_SUPABASE_ANON_KEY production
echo "AIzaSyBBD44Gy31o8al3_MoJFksfhVJGI9a7SA" | vercel env add VITE_YOUTUBE_API_KEY production
echo "8d3f0ac6611b0146296c5375c9634ef6" | vercel env add VITE_LASTFM_API_KEY production
echo "2973629e9394fb620c9ab505887651c" | vercel env add VITE_LASTFM_SECRET production
echo "AIzaSyBvjCxAr14EgWkuMbNN2tMZPNHctCoicqQ" | vercel env add VITE_GOOGLE_STUDIO_API_KEY production
echo "production" | vercel env add VITE_APP_ENVIRONMENT production
echo "DJfly Clean" | vercel env add VITE_APP_NAME production
echo "1.2.0" | vercel env add VITE_APP_VERSION production
echo "true" | vercel env add VITE_MAGIC_MATCH_ENABLED production
echo "true" | vercel env add VITE_MAGIC_SET_ENABLED production
echo "true" | vercel env add VITE_ANALYTICS_ENABLED production
echo "60" | vercel env add VITE_SESSION_TIMEOUT production
echo "5" | vercel env add VITE_MAX_LOGIN_ATTEMPTS production
echo "44100" | vercel env add VITE_AUDIO_SAMPLE_RATE production
echo "2048" | vercel env add VITE_AUDIO_BUFFER_SIZE production
echo "3000" | vercel env add VITE_PLAYER_CROSSFADE_DURATION production
echo "90" | vercel env add VITE_PLAYER_MAX_VOLUME production

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "🚀 Redeploying with new environment variables..."
vercel --prod

echo ""
echo "🎉 Fresh deployment complete!"
echo "📋 Your new clean deployment:"
echo "   https://djfly-clean-v3-feo5o1l96-liyams-projects.vercel.app"
echo ""
echo "🔧 To check deployment status:"
echo "   vercel ls"

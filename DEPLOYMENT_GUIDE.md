# 🚀 DJfly Clean - Deployment Guide

## 📋 API Setup Checklist

### 🤖 AI Services (Required for Core Features)

#### 1. OpenAI API (Magic Set & Match AI)
- **Sign up:** https://platform.openai.com/
- **Get API Key:** Dashboard → API Keys → Create new secret key
- **Pricing:** ~$0.002/1K tokens (very affordable for music prompts)
- **Required for:** AI playlist generation, crowd analysis

#### 2. Anthropic Claude API (Alternative AI)
- **Sign up:** https://console.anthropic.com/
- **Get API Key:** Account → API Keys
- **Pricing:** Similar to OpenAI, good backup option
- **Optional:** Use as fallback for OpenAI

### 🎵 Music Streaming APIs

#### 3. Spotify Web API (Essential)
- **Sign up:** https://developer.spotify.com/dashboard
- **Create App:** Dashboard → Create App
- **Get Credentials:** Client ID & Client Secret
- **Redirect URI:** `https://your-domain.vercel.app/auth/spotify/callback`
- **Required for:** Music search, track data, streaming

#### 4. YouTube Data API (Recommended)
- **Sign up:** https://console.cloud.google.com/
- **Enable API:** APIs & Services → YouTube Data API v3
- **Get Key:** Credentials → Create API Key
- **Required for:** YouTube music integration

### 🌐 Backend Services

#### 5. Supabase (Database & Auth)
- **Sign up:** https://supabase.com/
- **Create Project:** Dashboard → New Project
- **Get Keys:** Settings → API → Project URL & anon key
- **Required for:** User data, playlists, analytics

### 📊 Analytics (Optional but Recommended)

#### 6. Google Analytics 4
- **Sign up:** https://analytics.google.com/
- **Create Property:** Admin → Create Property
- **Get Measurement ID:** Data Streams → Web
- **Required for:** User behavior analytics

#### 7. Sentry (Error Monitoring)
- **Sign up:** https://sentry.io/
- **Create Project:** JavaScript → React
- **Get DSN:** Settings → Client Keys
- **Required for:** Production error tracking

### 💳 Payment (For Premium Features)

#### 8. Stripe (Payment Processing)
- **Sign up:** https://dashboard.stripe.com/register
- **Get Keys:** Developers → API Keys
- **Test Mode:** Use test keys first
- **Required for:** Subscription billing

## 🔧 Vercel Environment Variables Setup

### Step 1: Go to Vercel Dashboard
1. Open your deployed app: https://vercel.com/dashboard
2. Select your `djfly-clean-v2` project
3. Go to Settings → Environment Variables

### Step 2: Add Required Variables

#### 🚨 Critical (App won't work without these):
```
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_SPOTIFY_CLIENT_ID=your-spotify-client-id
VITE_SPOTIFY_CLIENT_SECRET=your-client-secret
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 🔧 Configuration (Set these for production):
```
VITE_APP_ENVIRONMENT=production
VITE_MAGIC_MATCH_ENABLED=true
VITE_MAGIC_SET_ENABLED=true
VITE_SPOTIFY_REDIRECT_URI=https://your-domain.vercel.app/auth/spotify/callback
```

#### 📊 Analytics (Optional):
```
VITE_GA_MEASUREMENT_ID=G-your-measurement-id
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### Step 3: Set Environment for Each Variable
- **Environment:** Production, Preview, Development
- **All variables** should be available in all environments

## 🛠️ Quick Start for Development

### Minimal Setup (Get Started Fast):
1. **OpenAI API** - For AI features ($5 credit gets you started)
2. **Spotify Developer** - Free, just need app registration  
3. **Supabase** - Free tier with generous limits

### Full Production Setup:
1. All AI services (OpenAI + Anthropic backup)
2. All music services (Spotify + YouTube + SoundCloud)
3. Database (Supabase with proper backup)
4. Analytics (Google Analytics + Sentry)
5. Payments (Stripe for premium features)

## 🔐 Security Best Practices

### ✅ Do:
- Use environment variables for all API keys
- Set up proper CORS origins in APIs
- Enable rate limiting on all services
- Use Supabase RLS (Row Level Security)
- Monitor API usage and set billing alerts

### ❌ Don't:
- Commit API keys to version control
- Use production keys in development
- Share environment variables in plain text
- Skip error monitoring in production

## 🚀 Deployment Steps

### 1. Set up APIs (use this guide)
### 2. Add environment variables to Vercel
### 3. Trigger redeployment
### 4. Test all features work correctly

## 🆘 Troubleshooting

### Common Issues:

#### "OpenAI API Error"
- Check API key is valid and has credits
- Verify environment variable name: `VITE_OPENAI_API_KEY`

#### "Spotify Authentication Failed"
- Check redirect URI matches exactly
- Verify client ID/secret are correct
- Make sure Spotify app is not in development mode

#### "Supabase Connection Error"
- Verify project URL and anon key
- Check if Supabase project is active
- Review RLS policies if using them

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test API keys individually
4. Check service status pages
5. Review this guide step by step

---

🎵 **Ready to launch your AI DJ platform!**
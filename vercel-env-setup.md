# 🚀 Vercel Environment Variables - Copy & Paste Setup

## Quick Setup for Vercel Dashboard

Copy the environment variables below and paste them into your Vercel project settings.

**Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

---

## 🚨 CRITICAL VARIABLES (Required for app to work)

Add these first - the app won't function without them:

### OpenAI API (AI Features)
```
VITE_OPENAI_API_KEY
```
**Value:** `sk-your-openai-api-key-here`  
**Environment:** Production, Preview, Development

### Spotify API (Music Integration)
```
VITE_SPOTIFY_CLIENT_ID
```
**Value:** `your-spotify-client-id-here`  
**Environment:** Production, Preview, Development

```
VITE_SPOTIFY_CLIENT_SECRET
```
**Value:** `your-spotify-client-secret-here`  
**Environment:** Production, Preview, Development

```
VITE_SPOTIFY_REDIRECT_URI
```
**Value:** `https://your-domain.vercel.app/auth/spotify/callback`  
**Environment:** Production, Preview, Development

### Supabase Database
```
VITE_SUPABASE_URL
```
**Value:** `https://your-project.supabase.co`  
**Environment:** Production, Preview, Development

```
VITE_SUPABASE_ANON_KEY
```
**Value:** `your-supabase-anon-key-here`  
**Environment:** Production, Preview, Development

---

## 🔧 CONFIGURATION VARIABLES (Recommended)

### App Configuration
```
VITE_APP_ENVIRONMENT
```
**Value:** `production`  
**Environment:** Production

```
VITE_APP_NAME
```
**Value:** `DJfly Clean`  
**Environment:** Production, Preview, Development

```
VITE_APP_VERSION
```
**Value:** `1.0.0`  
**Environment:** Production, Preview, Development

### Feature Flags
```
VITE_MAGIC_MATCH_ENABLED
```
**Value:** `true`  
**Environment:** Production, Preview, Development

```
VITE_MAGIC_SET_ENABLED
```
**Value:** `true`  
**Environment:** Production, Preview, Development

```
VITE_ANALYTICS_ENABLED
```
**Value:** `true`  
**Environment:** Production, Preview, Development

---

## 📊 ANALYTICS VARIABLES (Optional but Recommended)

### Google Analytics
```
VITE_GA_MEASUREMENT_ID
```
**Value:** `G-your-measurement-id-here`  
**Environment:** Production, Preview

### Sentry Error Monitoring
```
VITE_SENTRY_DSN
```
**Value:** `https://your-sentry-dsn-here`  
**Environment:** Production, Preview

---

## 🎵 ADDITIONAL MUSIC SERVICES (Optional)

### YouTube Integration
```
VITE_YOUTUBE_API_KEY
```
**Value:** `your-youtube-api-key-here`  
**Environment:** Production, Preview, Development

### SoundCloud Integration
```
VITE_SOUNDCLOUD_CLIENT_ID
```
**Value:** `your-soundcloud-client-id-here`  
**Environment:** Production, Preview, Development

---

## 🤖 BACKUP AI SERVICES (Optional)

### Anthropic Claude
```
VITE_ANTHROPIC_API_KEY
```
**Value:** `sk-ant-your-anthropic-key-here`  
**Environment:** Production, Preview, Development

---

## ⚡ Quick Copy-Paste for Vercel

**For fastest setup, copy this list and paste variable names one by one:**

```
VITE_OPENAI_API_KEY
VITE_SPOTIFY_CLIENT_ID
VITE_SPOTIFY_CLIENT_SECRET
VITE_SPOTIFY_REDIRECT_URI
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_APP_ENVIRONMENT
VITE_MAGIC_MATCH_ENABLED
VITE_MAGIC_SET_ENABLED
VITE_ANALYTICS_ENABLED
VITE_GA_MEASUREMENT_ID
VITE_SENTRY_DSN
```

---

## 🔄 After Adding Variables

1. **Redeploy:** Vercel will automatically redeploy when you add environment variables
2. **Test:** Visit your live site and check browser console for any missing variables
3. **Monitor:** Check Vercel deployment logs for any environment-related errors

---

## 🆘 Testing Your Setup

After deployment, open browser console on your live site. You should see:
- ✅ "All required environment variables are set"
- 🎵 Feature flags showing as enabled
- 🤖 AI services showing as available

If you see warnings, double-check the variable names and values in Vercel dashboard.

---

**🎵 Your AI DJ platform will be fully functional once these are configured!**
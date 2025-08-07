# 🔑 API Credentials Setup Guide

## Current Status: ❌ Demo/Placeholder Credentials Detected

The application is currently using placeholder API credentials that won't work with real services. Here's how to get real credentials:

---

## 🎵 Spotify API Setup

### 1. Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in:
   - **App name**: "DJfly Local Dev" (or your choice)
   - **App description**: "DJ music platform for local development"
   - **Redirect URI**: `http://localhost:5173/auth/spotify/callback`
   - **Which API/SDKs are you planning to use?**: Check "Web API"

### 2. Get Your Credentials

After creating the app:

1. Click on your app name
2. Go to "Settings"
3. Copy the **Client ID** and **Client secret**

### 3. Update .env file

Replace the placeholder values:

```bash
VITE_SPOTIFY_CLIENT_ID=your_real_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_real_client_secret_here
```

---

## 🗄️ Supabase Database Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up/Login and click "New project"
3. Choose organization, name your project, set password
4. Wait for database to provision (~2 minutes)

### 2. Run Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Copy the contents of `database/schema.sql` and execute it
3. This creates the tables: users, dj_sessions, user_preferences

### 3. Get Your Credentials

1. Go to Project Settings → API
2. Copy the **Project URL** and **anon/public key**

### 4. Update .env file

Replace the placeholder values:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🤖 OpenAI API Setup (Optional)

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys section
4. Create a new secret key

### 2. Update .env file

```bash
VITE_OPENAI_API_KEY=sk-your_real_openai_key_here
```

---

## 🔧 Testing Your Setup

After updating your credentials:

1. **Restart the development server**:

   ```bash
   npm run dev
   ```

2. **Check API Status**: Click the API Status indicator in the top-right corner

3. **Expected Results**:
   - 🟢 **Spotify**: ✅ Music data & tracks - Online
   - 🟢 **Supabase**: ✅ Database & storage - Online
   - 🟢 **OpenAI**: ✅ AI recommendations - Online

---

## 🚫 Security Notes

- **Never commit real API keys to git**
- The `.env` file is already in `.gitignore`
- For production, use environment variables on your hosting platform
- Consider using different credentials for development vs production

---

## 🆘 Troubleshooting

### Spotify 400 Error

- Double-check client ID and secret are correct
- Ensure no extra spaces in credentials
- Verify redirect URI matches exactly in Spotify app settings

### Supabase 404 Error

- Confirm project URL is correct (should end in `.supabase.co`)
- Run the database schema if tables don't exist
- Check anon key is the public/anon key, not service role

### OpenAI 401 Error

- Verify API key starts with `sk-`
- Check you have sufficient credits on OpenAI account
- Ensure API key has proper permissions

---

## 🎉 What Works With Demo Credentials

Even with placeholder credentials, the app provides:

- ✅ **Local Music Library**: Curated tracks with proper metadata
- ✅ **Analytics Engine**: Real-time performance tracking
- ✅ **DJ Interface**: Professional controls and effects
- ✅ **Offline Mode**: Local storage fallbacks
- ✅ **Audio Engine**: Bulletproof playback with MagicPlayer

The app gracefully falls back to demo mode when real APIs aren't available!

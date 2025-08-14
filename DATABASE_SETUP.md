# Database Setup Guide

## 🚨 **Current Issue: Supabase 404 Errors**

The application is getting 404 errors from Supabase because the database schema hasn't been deployed yet.

## 🔧 **Quick Fix: Deploy the Enhanced Schema**

### **Option 1: Use Supabase Dashboard**

1. Go to your Supabase project: https://supabase.com/dashboard/project/rwrmwymefgpfuztdtqbw
2. Navigate to **SQL Editor**
3. Copy and paste the entire content from `database/enhanced_schema.sql`
4. Click **Run** to execute the schema

### **Option 2: Use Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref rwrmwymefgpfuztdtqbw

# Deploy the schema
supabase db push
```

## 📋 **What the Schema Includes:**

- ✅ **Users table** (extends Supabase auth)
- ✅ **Sessions table** (for DJ sessions)
- ✅ **Tracks table** (for music library)
- ✅ **Sets table** (for playlists)
- ✅ **Analytics tables** (for performance tracking)
- ✅ **Row Level Security** (RLS) policies
- ✅ **Triggers** for automatic timestamps

## 🎯 **After Schema Deployment:**

The following errors should be resolved:

- ❌ `404 (Bad Request)` from Supabase
- ❌ `invalid input syntax for type bigint`
- ❌ Database connection issues

## 🔍 **Verify Setup:**

1. **Check Supabase Dashboard** - Tables should appear in the Table Editor
2. **Test the Application** - User registration should work
3. **Check Console** - No more 404 errors from Supabase

## 🚀 **Alternative: Use Demo Mode**

If you want to test the app without setting up the database immediately:

1. The app will gracefully fall back to demo data
2. All other APIs (Spotify, OpenAI, etc.) will still work
3. You can set up the database later

## 📞 **Need Help?**

- Check the Supabase documentation: https://supabase.com/docs
- Verify your project URL and keys are correct
- Make sure you have admin access to the Supabase project

---

**Note:** The application will work with demo data even without the database schema, but for full functionality, you'll need to deploy the schema.

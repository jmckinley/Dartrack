# Complete Deployment Guide for DarTrack
## From Zero to Production in 45 Minutes

This guide walks you through deploying DarTrack with full Gmail integration in the correct sequence.

---

## Prerequisites (5 minutes)

You'll need accounts for these services (all free):

- [ ] GitHub account (for Railway and Vercel)
- [ ] Google account (for Gmail OAuth and Gemini API)
- [ ] Supabase account (for database)

---

## Part 1: Supabase Database Setup (10 minutes)

### Step 1.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `dartrack`
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for database to initialize

### Step 1.2: Get Supabase Credentials

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these 3 values (you'll need them multiple times):

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

⚠️ **Important**: The `service_role` key is SECRET. Never expose it in frontend code!

### Step 1.3: Run Database Schema

1. Click **SQL Editor** in left sidebar
2. Click **"New Query"**
3. Copy and paste this entire SQL script:

```sql
-- DarTrack Database Schema

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pending tasks table
CREATE TABLE IF NOT EXISTS pending_tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  days INTEGER[] DEFAULT '{}',
  time TEXT DEFAULT '00:00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  sync_times TEXT[] DEFAULT '{}',
  canvas_ical_url TEXT,
  school_email_domain TEXT,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gmail tokens table (for OAuth)
CREATE TABLE IF NOT EXISTS gmail_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own pending tasks" ON pending_tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own courses" ON courses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own settings" ON settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own gmail tokens" ON gmail_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gmail_tokens_user_id ON gmail_tokens(user_id);
```

4. Click **"Run"** or press `Ctrl+Enter`
5. You should see: **"Success. No rows returned"**

### Step 1.4: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Find **Google** provider
3. Click to expand it
4. Toggle **"Enable Sign in with Google"**
5. You'll add Client ID and Secret later (after we create them in Part 3)
6. For now, just enable it

### Step 1.5: Configure Auth URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:5173` (we'll update this later)
3. Add **Redirect URLs**: `http://localhost:5173/**`

✅ **Checkpoint**: Your database is now ready!

---

## Part 2: Get Gemini API Key (2 minutes)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy your API key: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

⚠️ Save this key - you'll need it for Railway!

---

## Part 3: Google Cloud Console - Gmail OAuth Setup (15 minutes)

### Step 3.1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/projectcreate)
2. **Project name**: `DarTrack`
3. Click **"CREATE"**
4. Wait 30 seconds for project creation
5. Make sure "DarTrack" is selected in the top dropdown

### Step 3.2: Enable Gmail API

1. Go to [Gmail API Library](https://console.cloud.google.com/apis/library/gmail.googleapis.com)
2. Make sure **"DarTrack"** project is selected
3. Click **"ENABLE"**
4. Wait for it to enable (~10 seconds)

### Step 3.3: Configure OAuth Consent Screen

1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. Select **"External"**
3. Click **"CREATE"**

**App Information:**
```
App name: DarTrack
User support email: [YOUR EMAIL ADDRESS]
App logo: (skip - optional)
```

**App domain (skip all these - optional):**
```
Application home page: (leave blank)
Application privacy policy link: (leave blank)
Application terms of service link: (leave blank)
```

**Authorized domains:**
- Skip for now (we'll add later)

**Developer contact information:**
```
Email addresses: [YOUR EMAIL ADDRESS]
```

4. Click **"SAVE AND CONTINUE"**

### Step 3.4: Add Scopes

1. Click **"ADD OR REMOVE SCOPES"**
2. In the filter box at the top, type: `gmail.readonly`
3. Check the box next to: `https://www.googleapis.com/auth/gmail.readonly`
4. Click **"UPDATE"** at the bottom
5. Click **"SAVE AND CONTINUE"**

### Step 3.5: Add Test Users

1. Click **"ADD USERS"**
2. Enter your email address (the one you'll use to test)
3. Click **"ADD"**
4. Click **"SAVE AND CONTINUE"**
5. Review the summary
6. Click **"BACK TO DASHBOARD"**

⚠️ **Important**: While in Testing mode, only test users (max 100) can connect Gmail. This is fine for now!

### Step 3.6: Create OAuth Credentials (Partial)

**⚠️ STOP! Don't complete this step yet!**

We need the Railway URL first. Keep this tab open, we'll come back to it.

---

## Part 4: Deploy Backend to Railway (10 minutes)

### Step 4.1: Create Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Login"** → Sign in with **GitHub**
3. Authorize Railway to access your repositories
4. Click **"Deploy from GitHub repo"**
5. Select your **DarTrack** repository
6. Railway will automatically start deploying

### Step 4.2: Wait for Initial Deployment

- Watch the logs in the **Deployments** tab
- This takes 2-3 minutes
- You'll see: ✅ **"Success"** when done

### Step 4.3: Generate Railway Domain

1. Click **Settings** tab
2. Scroll to **Networking** section
3. Click **"Generate Domain"**
4. Copy your URL: `https://dartrack-production-xxxx.up.railway.app`

📋 **SAVE THIS URL!** You'll need it multiple times.

### Step 4.4: Add Environment Variables (Partial)

Go to **Variables** tab → Click **"+ New Variable"**

Add these **5 variables** now (we'll add 3 more later):

```env
GEMINI_API_KEY
```
Value: (paste your Gemini API key from Part 2)

```env
SUPABASE_URL
```
Value: (paste your Supabase Project URL from Part 1.2)

```env
SUPABASE_SERVICE_ROLE_KEY
```
Value: (paste your Supabase service_role key from Part 1.2)

```env
CLIENT_URL
```
Value: `http://localhost:5173` (temporary - we'll update this later)

```env
PORT
```
Value: `3001`

Railway will automatically redeploy after adding variables (takes ~1 minute).

⚠️ **Don't add Gmail variables yet** - we need to finish OAuth setup first!

---

## Part 5: Finish Gmail OAuth Setup (5 minutes)

### Step 5.1: Create OAuth Client ID

Go back to your Google Cloud Console tab (or open [Credentials](https://console.cloud.google.com/apis/credentials))

1. Click **"CREATE CREDENTIALS"** → **"OAuth client ID"**
2. Application type: **"Web application"**
3. Name: `DarTrack Web Client`

**Authorized JavaScript origins:**
```
http://localhost:5173
```

(We'll add production URL later)

**Authorized redirect URIs:**
```
http://localhost:3001/api/auth/gmail/callback
https://[YOUR-RAILWAY-URL]/api/auth/gmail/callback
```

⚠️ **Replace `[YOUR-RAILWAY-URL]`** with your actual Railway URL from Step 4.3!

Example:
```
https://dartrack-production-a1b2.up.railway.app/api/auth/gmail/callback
```

4. Click **"CREATE"**

### Step 5.2: Copy OAuth Credentials

You'll see a popup with your credentials:

```
Client ID: xxxxx.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxx
```

📋 **Copy these immediately!** Click the download button to save as JSON if you want backup.

---

## Part 6: Complete Railway Environment Variables (2 minutes)

Go back to Railway → **Variables** tab → **"+ New Variable"**

Add these final **3 variables**:

```env
GMAIL_CLIENT_ID
```
Value: (paste Client ID from Step 5.2)

```env
GMAIL_CLIENT_SECRET
```
Value: (paste Client Secret from Step 5.2)

```env
GMAIL_REDIRECT_URI
```
Value: `https://[YOUR-RAILWAY-URL]/api/auth/gmail/callback`

Example: `https://dartrack-production-a1b2.up.railway.app/api/auth/gmail/callback`

Railway will auto-redeploy (~1 minute).

✅ **Checkpoint**: Your backend is fully configured and deployed!

---

## Part 7: Deploy Frontend to Vercel (10 minutes)

### Step 7.1: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Login"** → Sign in with **GitHub**
3. Click **"Import Project"**
4. Select your **DarTrack** repository
5. Vercel will auto-detect settings from `vercel.json`

### Step 7.2: Configure Environment Variables

In the **Environment Variables** section, add these **3 variables**:

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: [Your Supabase URL from Part 1.2]
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: [Your Supabase anon key from Part 1.2]
```

**Variable 3:**
```
Name: VITE_API_URL
Value: [Your Railway URL from Part 4.3]
```

Example: `https://dartrack-production-a1b2.up.railway.app`

### Step 7.3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Click **"Continue to Dashboard"** when done
4. Click **"Visit"** to see your app
5. Copy your Vercel URL: `https://dartrack-xxx.vercel.app`

📋 **SAVE THIS URL!**

✅ **Checkpoint**: Your frontend is deployed!

---

## Part 8: Update URLs (Final Configuration) (5 minutes)

### Step 8.1: Update Railway CLIENT_URL

1. Go to Railway → **Variables** tab
2. Click on `CLIENT_URL` variable
3. Change value from `http://localhost:5173` to **your Vercel URL**
4. Example: `https://dartrack-xxx.vercel.app`
5. Railway will auto-redeploy

### Step 8.2: Update Google Cloud Console

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on **"DarTrack Web Client"** (the OAuth client you created)
3. Under **"Authorized JavaScript origins"**, click **"+ ADD URI"**
4. Add: `https://dartrack-xxx.vercel.app` (your Vercel URL)
5. Click **"SAVE"**

### Step 8.3: Update Supabase Auth URLs

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Update **Site URL** to: `https://dartrack-xxx.vercel.app` (your Vercel URL)
3. Update **Redirect URLs** to: `https://dartrack-xxx.vercel.app/**`
4. Click **"Save"**

### Step 8.4: Add Vercel Domain to Google Cloud (Optional)

1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. Click **"EDIT APP"**
3. Under **"Authorized domains"**, click **"ADD DOMAIN"**
4. Add: `vercel.app`
5. Click through **"SAVE AND CONTINUE"** on all pages

✅ **Configuration Complete!**

---

## Part 9: Test Everything! (5 minutes)

### Step 9.1: Test Frontend

1. Visit your Vercel URL: `https://dartrack-xxx.vercel.app`
2. You should see the DarTrack login screen
3. Click **"Sign in with Google"**
4. Authorize with your Google account
5. You should be logged in!

### Step 9.2: Test Gmail Connection

1. In DarTrack, tap bottom navigation → **Settings**
2. Scroll down to **"Gmail Connection"** section
3. Click **"Connect Gmail"**
4. You'll be redirected to Google OAuth
5. Select your account
6. Click **"Allow"** to grant read-only Gmail access
7. You should be redirected back to DarTrack
8. Status should show: **"Gmail Connected"** ✅

### Step 9.3: Test Email Sync

1. Tap **Home** or **Inbox** in bottom nav
2. Pull down to refresh OR tap **"Sync"** button
3. Wait 5-10 seconds
4. You should see new tasks appear in your **Inbox**!

🎉 **Success! Your app is fully deployed and working!**

---

## Troubleshooting

### "redirect_uri_mismatch" error
- Check that `GMAIL_REDIRECT_URI` in Railway **exactly** matches what's in Google Cloud Console
- Should be: `https://your-railway-url.up.railway.app/api/auth/gmail/callback`
- No trailing slashes
- Make sure it's `https://` not `http://`

### "Access blocked: This app's request is invalid"
- Make sure your email is added as a test user in Google Cloud Console OAuth consent screen
- Go to OAuth Consent Screen → Test Users → Add Users

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel matches Railway URL exactly
- Check `CLIENT_URL` in Railway matches Vercel URL exactly
- No trailing slashes on either!

### No emails showing up after sync
- Check Railway logs: Railway project → **Logs** tab
- Make sure you have emails in your Gmail from last 30 days
- Check that `school_email_domain` in Settings matches your email domain

### "Invalid credentials" in Railway logs
- Verify all 8 environment variables are set correctly in Railway
- Check that `SUPABASE_SERVICE_ROLE_KEY` is the service_role key (not anon key)
- Verify `GEMINI_API_KEY` is valid

### Gmail connection shows "Not Connected" after authorizing
- Check Railway logs for errors during OAuth callback
- Verify `gmail_tokens` table exists in Supabase
- Check that RLS policies are enabled

---

## Deployment Checklist

Use this to track your progress:

**Part 1: Supabase (10 min)**
- [ ] Created Supabase project
- [ ] Saved Project URL, anon key, service_role key
- [ ] Ran complete database schema SQL
- [ ] Enabled Google authentication provider
- [ ] Configured auth redirect URLs

**Part 2: Gemini API (2 min)**
- [ ] Created Gemini API key
- [ ] Saved API key

**Part 3: Google Cloud (15 min)**
- [ ] Created Google Cloud project "DarTrack"
- [ ] Enabled Gmail API
- [ ] Configured OAuth consent screen
- [ ] Added scopes: gmail.readonly
- [ ] Added myself as test user
- [ ] Created OAuth credentials (partial)
- [ ] Saved Client ID and Client Secret

**Part 4: Railway Backend (10 min)**
- [ ] Deployed to Railway from GitHub
- [ ] Generated Railway domain
- [ ] Saved Railway URL
- [ ] Added 5 initial environment variables

**Part 5: Complete Gmail OAuth (5 min)**
- [ ] Added redirect URIs to OAuth client
- [ ] Downloaded OAuth credentials

**Part 6: Complete Railway Config (2 min)**
- [ ] Added 3 Gmail environment variables to Railway
- [ ] Verified all 8 variables present

**Part 7: Vercel Frontend (10 min)**
- [ ] Deployed to Vercel from GitHub
- [ ] Added 3 environment variables
- [ ] Saved Vercel URL

**Part 8: Final Updates (5 min)**
- [ ] Updated CLIENT_URL in Railway
- [ ] Added Vercel URL to Google Cloud authorized origins
- [ ] Updated Supabase auth URLs
- [ ] Added vercel.app to Google Cloud authorized domains

**Part 9: Testing (5 min)**
- [ ] Logged in to app successfully
- [ ] Connected Gmail successfully
- [ ] Synced emails and saw tasks appear

---

## Your Deployment URLs

Fill these in as you go:

```
Supabase URL: https://__________________________________.supabase.co

Railway Backend: https://__________________________________.up.railway.app

Vercel Frontend: https://__________________________________.vercel.app

Google Cloud Project: DarTrack
  Client ID: __________________________________.apps.googleusercontent.com
  Client Secret: GOCSPX-__________________________________________

Gemini API Key: AIzaSy__________________________________________
```

---

## Cost Summary

**Total Monthly Cost: $0 - $5**

- **Supabase**: Free tier (500MB database, 50K monthly active users)
- **Railway**: $5/month after free trial credit expires (~$2-3/month actual usage)
- **Vercel**: Free tier (100GB bandwidth)
- **Google Cloud** (Gmail API): Free (1 billion quota units/day)
- **Gemini API**: Free tier (15 requests/minute)

---

## Next Steps

1. **Add more test users**: Go to Google Cloud Console → OAuth Consent Screen → Test Users
2. **Customize settings**: Add your Canvas iCal URL, school email domain
3. **Publish OAuth app** (optional): To allow unlimited users, submit for Google verification (takes 4-6 weeks)
4. **Custom domain** (optional): Add custom domain in Vercel settings
5. **Monitoring**: Set up error tracking with Sentry or LogRocket

---

## Support

If you get stuck:
1. Check the **Troubleshooting** section above
2. Check Railway logs for backend errors
3. Check browser console for frontend errors
4. Verify all environment variables are correct
5. Make sure all URLs have been updated (no localhost in production!)

---

**Congratulations! 🎉 DarTrack is now live in production!**

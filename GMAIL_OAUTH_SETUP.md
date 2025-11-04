# Gmail OAuth Setup Guide

This guide explains how to set up Gmail OAuth for DarTrack to read real emails from users' Gmail accounts.

## Overview

Gmail OAuth allows users to securely connect their Gmail account to DarTrack. The app will:
- Only request read-only access to Gmail
- Fetch emails from the last 30 days
- Use AI to extract academic tasks from professor emails
- Store OAuth tokens securely in your Supabase database

**Important:** If you don't set up Gmail OAuth, the app will use mock email data (which still demonstrates the AI capability).

## Prerequisites

- Google Cloud account (free)
- Your deployed backend URL (Railway URL)
- Your deployed frontend URL (Vercel URL)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it: **"DarTrack"**
4. Click **"Create"**

## Step 2: Enable Gmail API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Gmail API"**
3. Click on it and click **"Enable"**

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace)
3. Click **"Create"**

### Fill in the form:

**App information:**
- App name: **DarTrack**
- User support email: **your-email@gmail.com**
- App logo: (optional)

**App domain:**
- Application home page: **your-vercel-url** (e.g., `https://dartrak.vercel.app`)
- Privacy policy: **your-vercel-url/privacy** (create later)
- Terms of service: **your-vercel-url/terms** (create later)

**Authorized domains:**
- Add your Vercel domain (e.g., `vercel.app`)
- Add your Railway domain (e.g., `railway.app`)

**Developer contact:**
- Email: **your-email@gmail.com**

4. Click **"Save and Continue"**

### Add Scopes:

1. Click **"Add or Remove Scopes"**
2. Search for **"gmail.readonly"**
3. Select: **`https://www.googleapis.com/auth/gmail.readonly`**
4. Click **"Update"** → **"Save and Continue"**

### Test users (while in testing mode):

1. Click **"Add Users"**
2. Add your email and any test users' emails
3. Click **"Save and Continue"**

4. Review and click **"Back to Dashboard"**

## Step 4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: **"DarTrack Web"**

**Authorized JavaScript origins:**
- `http://localhost:5173` (for local development)
- Your Vercel URL (e.g., `https://dartrak.vercel.app`)

**Authorized redirect URIs:**
- `http://localhost:3001/api/auth/gmail/callback` (for local development)
- Your Railway URL + `/api/auth/gmail/callback` (e.g., `https://dartrak-production.up.railway.app/api/auth/gmail/callback`)

5. Click **"Create"**

### Save Your Credentials:

You'll see a popup with:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

**Important:** Copy these and save them securely!

## Step 5: Update Environment Variables

### Local Development (.env.local):

```env
GMAIL_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-your_client_secret_here
GMAIL_REDIRECT_URI=http://localhost:3001/api/auth/gmail/callback
```

### Railway (Production):

Go to your Railway project → **Variables** tab and add:

```
GMAIL_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-your_client_secret_here
GMAIL_REDIRECT_URI=https://your-railway-url.up.railway.app/api/auth/gmail/callback
```

### Vercel (Frontend):

No changes needed - Gmail OAuth is backend-only!

## Step 6: Update Supabase Database

Run the new schema in your Supabase SQL Editor:

```sql
-- Gmail OAuth tokens table
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
ALTER TABLE gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can only access their own gmail tokens" ON gmail_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_gmail_tokens_user_id ON gmail_tokens(user_id);
```

Or run the complete `database-schema.sql` file if you haven't set up your database yet.

## Step 7: Test the Integration

1. **Redeploy your backend** (Railway will auto-deploy when you update environment variables)
2. Open your app and log in
3. Go to **Settings**
4. You should see a **"Connect Gmail"** button
5. Click it and authorize with your Google account
6. You'll be redirected back to the app
7. Try syncing - you should see real emails being processed!

## Troubleshooting

### "Access blocked: This app's request is invalid"

**Solution:** Make sure you added your redirect URI exactly in Google Cloud Console:
- Check for typos
- Ensure no trailing slashes
- Must match your Railway URL exactly

### "400 Bad Request: redirect_uri_mismatch"

**Solution:** The redirect URI in your code doesn't match Google Cloud Console:
1. Check `GMAIL_REDIRECT_URI` environment variable
2. Make sure it matches the authorized redirect URI in Google Cloud Console

### No emails fetched

**Possible causes:**
1. Gmail token not stored properly - check Supabase `gmail_tokens` table
2. No emails in last 30 days matching school domain filter
3. Check Railway logs for errors

### "Email not verified" error

**Solution:** Your app is in testing mode and the user isn't added as a test user:
- Add the user's email in Google Cloud Console → OAuth consent screen → Test users
- Or publish your app (requires verification)

## Publishing Your App

While in testing mode, only test users (max 100) can connect Gmail. To allow unlimited users:

1. Go to **OAuth consent screen**
2. Click **"Publish App"**
3. If you request sensitive scopes (like Gmail), you'll need to submit for verification
4. Verification process takes 4-6 weeks
5. Alternatively, stay in testing mode for initial launch

## Security Best Practices

✅ **DO:**
- Store OAuth tokens encrypted in database
- Use refresh tokens to maintain access
- Request minimum required scopes
- Implement token expiry checking
- Use HTTPS in production

❌ **DON'T:**
- Store OAuth tokens in localStorage
- Expose Client Secret in frontend code
- Request more Gmail permissions than needed
- Share OAuth credentials publicly

## Cost

Gmail API is **free** with generous limits:
- **1 billion quota units/day**
- Reading an email = ~5-10 units
- You can process **millions** of emails per day for free

## Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure database schema is up to date

## Optional: Add "Sign in with Google"

You can also add Google as a Supabase authentication provider:

1. In Supabase → **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Client ID and Client Secret
4. This is separate from Gmail OAuth but uses the same Google credentials

# Gmail OAuth - Super Easy Setup (15 Minutes)

I'll guide you through each step with **exact copy-paste commands**. No guessing!

---

## Step 1: Google Cloud Console (5 minutes)

### 1.1 Create Project
1. Go to: https://console.cloud.google.com/projectcreate
2. **Project name**: `DarTrack`
3. Click **CREATE**
4. Wait 30 seconds for project to be created

### 1.2 Enable Gmail API
1. Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com
2. Make sure "DarTrack" is selected in the top dropdown
3. Click **ENABLE**
4. Wait for it to enable

### 1.3 Configure OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Select **External**
3. Click **CREATE**

**Fill in ONLY these fields:**

```
App name: DarTrack
User support email: [YOUR EMAIL]
Developer contact email: [YOUR EMAIL]
```

Click **SAVE AND CONTINUE**

**Add Scopes:**
1. Click **ADD OR REMOVE SCOPES**
2. In the filter box, type: `gmail.readonly`
3. Check the box next to: `https://www.googleapis.com/auth/gmail.readonly`
4. Click **UPDATE**
5. Click **SAVE AND CONTINUE**

**Add Test Users:**
1. Click **ADD USERS**
2. Enter your email address
3. Click **ADD**
4. Click **SAVE AND CONTINUE**
5. Click **BACK TO DASHBOARD**

### 1.4 Create Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `DarTrack Web`

**IMPORTANT - You need your Railway URL first!**

---

## Step 2: Deploy Backend to Railway (5 minutes)

**Do this BEFORE creating OAuth credentials!**

1. Go to: https://railway.app/new
2. Click **Deploy from GitHub repo**
3. Select **kyliemckinleydemo/DarTrack**
4. Wait for deployment (2-3 minutes)
5. **Copy your Railway URL** - looks like: `https://dartrak-production-xxxx.up.railway.app`

**Save this URL!** You'll need it multiple times.

---

## Step 3: Finish OAuth Credentials

Back in Google Cloud Console credentials page:

**Authorized JavaScript origins:**
```
http://localhost:5173
YOUR_VERCEL_URL_HERE (add after deploying frontend)
```

**Authorized redirect URIs:**
```
http://localhost:3001/api/auth/gmail/callback
YOUR_RAILWAY_URL/api/auth/gmail/callback
```

Replace `YOUR_RAILWAY_URL` with the URL you copied from Railway.

Example:
```
https://dartrak-production-xxxx.up.railway.app/api/auth/gmail/callback
```

Click **CREATE**

**COPY THESE IMMEDIATELY:**
- Client ID: `xxxxx.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxxxx`

---

## Step 4: Add to Railway (2 minutes)

1. Go to your Railway project
2. Click **Variables** tab
3. Click **+ New Variable**

**Add these 8 variables ONE BY ONE:**

```
Name: GEMINI_API_KEY
Value: [YOUR GEMINI API KEY]

Name: SUPABASE_URL
Value: [YOUR SUPABASE URL]

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [YOUR SUPABASE SERVICE ROLE KEY]

Name: GMAIL_CLIENT_ID
Value: [PASTE CLIENT ID FROM STEP 3]

Name: GMAIL_CLIENT_SECRET
Value: [PASTE CLIENT SECRET FROM STEP 3]

Name: GMAIL_REDIRECT_URI
Value: [YOUR RAILWAY URL]/api/auth/gmail/callback

Name: CLIENT_URL
Value: http://localhost:5173 (update after deploying Vercel)

Name: PORT
Value: 3001
```

Railway will automatically redeploy. Wait 1-2 minutes.

---

## Step 5: Update Supabase Database (2 minutes)

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. **Copy-paste this ENTIRE block:**

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
DROP POLICY IF EXISTS "Users can only access their own gmail tokens" ON gmail_tokens;
CREATE POLICY "Users can only access their own gmail tokens" ON gmail_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_gmail_tokens_user_id ON gmail_tokens(user_id);
```

5. Click **RUN**
6. You should see "Success. No rows returned"

---

## Step 6: Deploy Frontend to Vercel (5 minutes)

1. Go to: https://vercel.com/new
2. Click **Import** next to kyliemckinleydemo/DarTrack
3. **Add these environment variables:**

```
Name: VITE_SUPABASE_URL
Value: [YOUR SUPABASE URL]

Name: VITE_SUPABASE_ANON_KEY
Value: [YOUR SUPABASE ANON KEY]

Name: VITE_API_URL
Value: [YOUR RAILWAY URL]
```

4. Click **Deploy**
5. Wait 2-3 minutes
6. **Copy your Vercel URL**: `https://dartrak-xxx.vercel.app`

---

## Step 7: Update URLs (2 minutes)

### Update Railway:
1. Go to Railway → Variables
2. Change `CLIENT_URL` from `http://localhost:5173` to **your Vercel URL**
3. Railway will redeploy automatically

### Update Google Cloud Console:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on "DarTrack Web" (the OAuth client you created)
3. Under **Authorized JavaScript origins**, add:
   - **Your Vercel URL** (e.g., `https://dartrak-xxx.vercel.app`)
4. Click **SAVE**

---

## Step 8: Test It! (1 minute)

1. Open your Vercel URL
2. Sign up / Log in
3. Go to **Settings** (bottom nav)
4. Scroll down - you should see **"Connect Gmail"**
5. Click it → Authorize with Google
6. You should be redirected back to your app
7. It should say **"Gmail Connected"** with your email!
8. Try the **Sync** button - it will fetch your real emails! 🎉

---

## ✅ Done!

Your app is now **100% fully functional** with real Gmail integration!

---

## 🆘 Troubleshooting

### "redirect_uri_mismatch" error
- Check that `GMAIL_REDIRECT_URI` in Railway exactly matches what's in Google Cloud Console
- No trailing slashes
- Must be `https://` (not `http://`) for Railway URL

### "Access blocked" error
- Make sure you added your email as a test user in Step 1.3
- App is in testing mode - only test users can connect

### No emails showing up
- Check Railway logs for errors
- Make sure you have emails from the last 30 days
- Check that school email domain filter matches your emails

### Can't find Railway URL
- Go to Railway project → Settings tab → Domains section

---

## 📋 Checklist

Use this to track your progress:

- [ ] Step 1: Created Google Cloud project
- [ ] Step 1: Enabled Gmail API
- [ ] Step 1: Configured OAuth consent screen
- [ ] Step 2: Deployed backend to Railway
- [ ] Step 2: Copied Railway URL
- [ ] Step 3: Created OAuth credentials
- [ ] Step 3: Saved Client ID and Secret
- [ ] Step 4: Added all variables to Railway
- [ ] Step 5: Ran SQL in Supabase
- [ ] Step 6: Deployed frontend to Vercel
- [ ] Step 6: Copied Vercel URL
- [ ] Step 7: Updated CLIENT_URL in Railway
- [ ] Step 7: Updated JavaScript origins in Google Cloud
- [ ] Step 8: Tested Gmail connection
- [ ] Step 8: Synced emails successfully!

---

**Questions?** Let me know which step you're stuck on and I'll help!

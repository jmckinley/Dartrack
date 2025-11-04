# Quick Reference - Fill This Out As You Go

Print this or keep it open in a separate tab!

---

## Your URLs & Credentials

### Railway Backend URL
```
https://__________________________________.up.railway.app
```

### Vercel Frontend URL
```
https://__________________________________.vercel.app
```

### Google OAuth Credentials
```
Client ID: ____________________________________________.apps.googleusercontent.com

Client Secret: GOCSPX-___________________________________________
```

### Supabase
```
URL: https://__________________________________.supabase.co

Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.______________________________________________

Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.______________________________________________
```

### Gemini API
```
API Key: AIzaSy___________________________________________
```

---

## Railway Environment Variables (Copy-Paste Template)

Once you have all the values above, copy this entire block and paste into Railway:

```env
GEMINI_API_KEY=AIzaSy___________________________________________
SUPABASE_URL=https://__________________________________.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.______________________________________________
GMAIL_CLIENT_ID=____________________________________________.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-___________________________________________
GMAIL_REDIRECT_URI=https://__________________________________.up.railway.app/api/auth/gmail/callback
CLIENT_URL=https://__________________________________.vercel.app
PORT=3001
```

---

## Vercel Environment Variables (Copy-Paste Template)

```env
VITE_SUPABASE_URL=https://__________________________________.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.______________________________________________
VITE_API_URL=https://__________________________________.up.railway.app
```

---

## Google Cloud OAuth Settings

### Authorized JavaScript origins:
```
http://localhost:5173
https://__________________________________.vercel.app
```

### Authorized redirect URIs:
```
http://localhost:3001/api/auth/gmail/callback
https://__________________________________.up.railway.app/api/auth/gmail/callback
```

---

## Supabase SQL Query

Go to SQL Editor and run this:

```sql
CREATE TABLE IF NOT EXISTS gmail_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gmail_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own gmail tokens" ON gmail_tokens;
CREATE POLICY "Users can only access their own gmail tokens" ON gmail_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_gmail_tokens_user_id ON gmail_tokens(user_id);
```

---

## Progress Checklist

- [ ] Have Gemini API key
- [ ] Have Supabase URL, Anon Key, Service Role Key
- [ ] Created Google Cloud project "DarTrack"
- [ ] Enabled Gmail API
- [ ] Configured OAuth consent screen
- [ ] Added myself as test user
- [ ] Deployed to Railway
- [ ] Copied Railway URL
- [ ] Created OAuth credentials in Google Cloud
- [ ] Copied Client ID and Secret
- [ ] Added all 8 variables to Railway
- [ ] Ran SQL in Supabase SQL Editor
- [ ] Deployed to Vercel
- [ ] Copied Vercel URL
- [ ] Updated CLIENT_URL in Railway
- [ ] Updated Google Cloud authorized origins
- [ ] Tested Gmail connection
- [ ] Successfully synced emails!

---

**Save this file locally so you can fill it out as you go!**

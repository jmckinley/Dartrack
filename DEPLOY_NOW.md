# Quick Deployment Guide

Follow these steps to deploy DarTrack to production.

## Step 1: Deploy Backend to Railway (5 minutes)

### 1.1 Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub (it will ask for repository access)

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **kyliemckinleydemo/DarTrack**
4. Railway will automatically detect it's a Node.js app

### 1.3 Add Environment Variables
Click on your project, then go to **Variables** tab and add:

```
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
CLIENT_URL=https://your-app.vercel.app
PORT=3001
```

**Optional - Gmail OAuth (Recommended):**
```
GMAIL_CLIENT_ID=your_gmail_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-your_gmail_client_secret
GMAIL_REDIRECT_URI=https://your-railway-url.up.railway.app/api/auth/gmail/callback
```

**Note:** If you skip Gmail OAuth, the app will use mock email data. See [GMAIL_OAUTH_SETUP.md](./GMAIL_OAUTH_SETUP.md) for full Gmail setup instructions.

**Important:** Leave `CLIENT_URL` as a placeholder for now - we'll update it after deploying the frontend.

### 1.4 Get Your Backend URL
- Railway will automatically deploy your backend
- Copy the URL (looks like: `https://your-app.up.railway.app`)
- **Save this URL** - you'll need it for Vercel!

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2.2 Import Project
1. Click **"Add New"** → **"Project"**
2. Import **kyliemckinleydemo/DarTrack**
3. Vercel will auto-detect the `vercel.json` configuration

### 2.3 Configure Build Settings
Vercel should automatically detect these from `vercel.json`:
- **Framework Preset**: Vite
- **Build Command**: `npm run build:client`
- **Output Directory**: `dist/client`

### 2.4 Add Environment Variables
In the **Environment Variables** section, add:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=https://your-app.up.railway.app
```

**Important:** Use the Railway URL you saved in Step 1.4 for `VITE_API_URL`

### 2.5 Deploy
- Click **Deploy**
- Wait 2-3 minutes for build to complete
- Copy your Vercel URL (looks like: `https://your-app.vercel.app`)

---

## Step 3: Update Railway with Frontend URL

### 3.1 Update CLIENT_URL
1. Go back to your Railway project
2. Go to **Variables** tab
3. Update `CLIENT_URL` to your Vercel URL from Step 2.5
4. Railway will automatically redeploy

---

## Step 4: Set Up Supabase (If Not Done)

### 4.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to be ready

### 4.2 Run Database Setup
1. Go to **SQL Editor** in Supabase dashboard
2. Copy the SQL from `README.md` (Section: "Set Up Supabase Database")
3. Paste and run it

### 4.3 Get Your Credentials
Go to **Project Settings** → **API**:
- **SUPABASE_URL**: Project URL
- **SUPABASE_ANON_KEY**: `anon` `public` key
- **SUPABASE_SERVICE_ROLE_KEY**: `service_role` `secret` key ⚠️ Keep this secret!

---

## Step 5: Enable Authentication

### 5.1 Configure Auth Providers
In Supabase dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Optional: Enable **Google**, **GitHub**, etc.

### 5.2 Update Site URL
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://your-app.vercel.app`
3. Add **Redirect URLs**: `https://your-app.vercel.app/**`

---

## ✅ Deployment Complete!

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

### Test Your Deployment
1. Visit your Vercel URL
2. Try signing up/logging in
3. Test the sync functionality
4. Check that tasks appear correctly

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
- **Check CORS**: Make sure `CLIENT_URL` in Railway matches your Vercel URL exactly
- **Check API URL**: Verify `VITE_API_URL` in Vercel points to Railway URL

### Authentication errors
- **Check Supabase URL**: Ensure both Railway and Vercel have the correct Supabase URL
- **Check Redirect URLs**: Make sure your Vercel URL is in Supabase's allowed URLs

### Gemini API errors
- **Check API Key**: Verify `GEMINI_API_KEY` is set correctly in Railway
- **Check Quota**: Ensure you haven't exceeded Gemini API limits

### Build failures
- **Railway**: Check logs in Railway dashboard
- **Vercel**: Check deployment logs in Vercel dashboard

---

## 📊 Monitoring Your Deployment

### Railway Dashboard
- View logs: Click on your project → **Logs** tab
- Monitor usage: Check **Metrics** tab
- Check environment variables: **Variables** tab

### Vercel Dashboard
- View deployment logs: Click on your project → **Deployments**
- Check analytics: **Analytics** tab
- Monitor errors: **Logs** tab

### Supabase Dashboard
- Database activity: **Database** → **Table Editor**
- Auth users: **Authentication** → **Users**
- API logs: **Logs Explorer**

---

## 💰 Cost Breakdown

### Railway
- **Free Tier**: $5 credit/month (~550 hours)
- **Hobby Plan**: $5/month for 500 hours
- Your backend should easily fit in free tier

### Vercel
- **Free Tier**: 100 GB bandwidth, unlimited deployments
- Frontend hosting is completely free for your use case

### Supabase
- **Free Tier**: 500 MB database, 50,000 monthly active users
- More than enough for initial launch

**Total monthly cost: $0** (using free tiers) 🎉

---

## 🚀 Next Steps

### 1. Set Up Gmail OAuth (Highly Recommended)

Currently, your app uses **mock email data** for demonstration. To enable real Gmail integration:

**Why enable Gmail OAuth?**
- ✅ Users connect their real Gmail accounts
- ✅ AI parses actual professor emails
- ✅ Automatic task extraction from real emails
- ✅ Full functionality unlocked

**How to set it up:**
1. Takes about 15-20 minutes
2. Follow the detailed guide: **[GMAIL_OAUTH_SETUP.md](./GMAIL_OAUTH_SETUP.md)**
3. Get credentials from Google Cloud Console (free)
4. Add to Railway environment variables
5. Run new database schema in Supabase

**If you skip this:**
- App works but uses mock professor emails
- Canvas integration still provides real automation
- Users can still add tasks manually

### 2. Custom Domain (Optional)
- Buy domain on Namecheap/Google Domains
- Add to Vercel in project settings
- Update `CLIENT_URL` in Railway

### 3. Monitoring (Recommended)
- Set up [Sentry](https://sentry.io) for error tracking
- Add analytics (Vercel Analytics is free)
- Monitor Railway logs regularly

### 4. Performance Optimization
- Enable Vercel Analytics
- Add caching headers
- Optimize images
- Monitor API usage

---

## 📚 Additional Resources

- **Gmail OAuth Setup**: [GMAIL_OAUTH_SETUP.md](./GMAIL_OAUTH_SETUP.md)
- **Database Schema**: [database-schema.sql](./database-schema.sql)
- **Detailed Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Main README**: [README.md](./README.md)

---

Need help? Check the guides above or open an issue on GitHub.

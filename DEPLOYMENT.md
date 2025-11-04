# Deployment Guide

This guide covers deploying DarTrack to production environments.

## Architecture Overview

DarTrack consists of two parts:
1. **Frontend** (Vite/React) - Static site that can be deployed to any CDN
2. **Backend** (Express/Node.js) - API server that needs a Node.js runtime

## Deployment Options

### Option 1: Separate Deployments (Recommended)

Deploy frontend and backend separately for better scalability and cost optimization.

#### Frontend Deployment (Vercel/Netlify/Cloudflare Pages)

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run build:client
vercel --prod
```

**Environment Variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (your backend URL)

#### Backend Deployment (Railway/Render/Fly.io)

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

**Environment Variables:**
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLIENT_URL` (your frontend URL for CORS)
- `PORT` (provided by platform)

### Option 2: Monolithic Deployment

Deploy both frontend and backend together on platforms like Render or Railway.

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

The Express server will serve the built frontend from `dist/client`.

Update `server/index.ts` to serve static files:
```typescript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../client')));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});
```

## Platform-Specific Guides

### Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway auto-detects build and start commands
4. Get your deployment URL

### Render

1. Create new Web Service
2. Connect repository
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Add environment variables
6. Deploy

### Vercel (Frontend Only)

1. Import project from Git
2. Framework Preset: Vite
3. Build Command: `npm run build:client`
4. Output Directory: `dist/client`
5. Add environment variables
6. Deploy

### Fly.io (Backend)

Create `fly.toml`:
```toml
app = "dartrak-api"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

Deploy:
```bash
fly launch
fly secrets set GEMINI_API_KEY=xxx SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx
fly deploy
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Verify Gemini AI integration works
- [ ] Test Canvas iCal sync
- [ ] Check CORS configuration
- [ ] Enable HTTPS (should be automatic on most platforms)
- [ ] Set up monitoring/logging
- [ ] Configure custom domain (optional)

## Security Considerations

1. **Never expose service role keys** - Only use on backend
2. **Enable RLS** on all Supabase tables
3. **Use HTTPS** in production
4. **Rotate API keys** regularly
5. **Monitor API usage** to prevent abuse
6. **Set rate limits** on sensitive endpoints

## Troubleshooting

### CORS Issues
If frontend can't reach backend, check:
- `CLIENT_URL` environment variable on backend
- CORS configuration in `server/index.ts`

### Authentication Fails
- Verify Supabase URL and keys match
- Check that RLS policies are correctly configured
- Ensure JWT tokens are being sent in Authorization header

### Gemini API Errors
- Verify API key is valid
- Check quota limits
- Review retry logic in `server/services/gemini.ts`

## Monitoring

Recommended monitoring services:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Better Stack** - Log management
- **Supabase Dashboard** - Database metrics

## Scaling Considerations

As your user base grows:
1. Enable Supabase connection pooling
2. Add Redis for caching
3. Implement queue system for email processing
4. Consider database read replicas
5. Add CDN for static assets

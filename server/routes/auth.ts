import { Router } from 'express';
import { google } from 'googleapis';
import { AuthRequest } from '../middleware/auth.js';
import { oauth2Client, getAuthUrl, isGmailConfigured } from '../config/gmail.js';

export const authRouter = Router();

// Check if Gmail OAuth is configured
authRouter.get('/gmail/status', async (req: AuthRequest, res) => {
  try {
    const configured = isGmailConfigured();

    if (!configured) {
      return res.json({
        configured: false,
        connected: false,
        message: 'Gmail OAuth not configured on server'
      });
    }

    // Check if user has connected Gmail
    const { data: tokens } = await req.supabase!
      .from('gmail_tokens')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    res.json({
      configured: true,
      connected: !!tokens,
      email: tokens?.email || null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Initiate Gmail OAuth flow
authRouter.get('/gmail/connect', async (req: AuthRequest, res) => {
  try {
    if (!isGmailConfigured()) {
      return res.status(400).json({
        error: 'Gmail OAuth not configured. Please set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET.'
      });
    }

    const authUrl = getAuthUrl(req.userId!);
    res.json({ authUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// OAuth callback handler
authRouter.get('/gmail/callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query;

    if (!code || !userId) {
      return res.status(400).send('Missing code or user ID');
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Get user's email address
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const email = profile.data.emailAddress;

    // Create Supabase client with service role to bypass RLS
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Store tokens in database
    await supabase
      .from('gmail_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        email: email,
      });

    // Redirect to frontend with success message
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}?gmail_connected=true`);
  } catch (error: any) {
    console.error('Gmail OAuth callback error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}?gmail_error=${encodeURIComponent(error.message)}`);
  }
});

// Disconnect Gmail
authRouter.post('/gmail/disconnect', async (req: AuthRequest, res) => {
  try {
    await req.supabase!
      .from('gmail_tokens')
      .delete()
      .eq('user_id', req.userId);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

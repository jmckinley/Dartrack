-- DarTrack Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

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

-- Gmail OAuth tokens table (NEW)
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only access their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can only access their own pending tasks" ON pending_tasks;
DROP POLICY IF EXISTS "Users can only access their own courses" ON courses;
DROP POLICY IF EXISTS "Users can only access their own settings" ON settings;
DROP POLICY IF EXISTS "Users can only access their own gmail tokens" ON gmail_tokens;

-- Create policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_pending_tasks_user_id ON pending_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_gmail_tokens_user_id ON gmail_tokens(user_id);

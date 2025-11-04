<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DarTrack - AI-Powered Academic Task Manager

An intelligent mobile-first Progressive Web App for students to manage academic tasks. DarTrack uses Google's Gemini AI to automatically extract assignments and deadlines from professor emails and integrates with Canvas via iCal feeds.

## Features

- 🤖 **AI-Powered Email Parsing**: Automatically extracts tasks from professor emails using Gemini AI
- 📧 **Gmail Integration**: Connect your Gmail to fetch real emails (OAuth 2.0)
- 📅 **Canvas Integration**: Syncs assignments via iCal feeds
- 📱 **Progressive Web App**: Install on mobile devices for native-like experience
- 🔔 **Smart Notifications**: Get reminded of upcoming deadlines
- 📊 **Task Management**: Organize tasks by course, type, and due date
- ⏰ **Intelligent Prep Deadlines**: Automatically adjusts prep work deadlines based on class schedule

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Flash
- **Data Fetching**: SWR for client-side caching
- **Authentication**: Supabase Auth

## Prerequisites

- Node.js 18+ and npm
- Supabase account (for database and authentication)
- Google Gemini API key (for AI features)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Backend Environment Variables (Server-side only)
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Frontend Environment Variables
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=http://localhost:3001
```

**Getting your credentials:**
- **Gemini API Key**: Get it from [Google AI Studio](https://aistudio.google.com/apikey)
- **Supabase credentials**: Create a project at [supabase.com](https://supabase.com) and find credentials in Project Settings > API
- **Gmail OAuth** (Optional): See [GMAIL_OAUTH_SETUP.md](./GMAIL_OAUTH_SETUP.md) for full setup. If skipped, app uses mock email data.

### 3. Set Up Supabase Database

Run the complete database schema in your Supabase SQL Editor. Copy the contents of [database-schema.sql](./database-schema.sql) or use the SQL below:

```sql
-- Tasks table
CREATE TABLE tasks (
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
CREATE TABLE pending_tasks (
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
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  days INTEGER[] DEFAULT '{}',
  time TEXT DEFAULT '00:00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  sync_times TEXT[] DEFAULT '{}',
  canvas_ical_url TEXT,
  school_email_domain TEXT,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only access their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own pending tasks" ON pending_tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own courses" ON courses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own settings" ON settings
  FOR ALL USING (auth.uid() = user_id);
```

### 4. Run the Application

Start both the client and server in development mode:

```bash
npm run dev
```

This will start:
- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3001

Alternatively, run them separately:

```bash
# Terminal 1 - Frontend
npm run dev:client

# Terminal 2 - Backend
npm run dev:server
```

### 5. Build for Production

```bash
npm run build
```

This builds both the client and server. To start the production server:

```bash
npm start
```

## Project Structure

```
dartrak/
├── server/               # Express backend
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic (Gemini AI, Gmail)
│   ├── middleware/      # Auth middleware
│   └── utils/           # Helper utilities
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # Frontend services
├── utils/              # Frontend utilities
├── types.ts            # TypeScript type definitions
└── index.tsx           # Frontend entry point
```

## Architecture

DarTrack uses a **Vite + Express** architecture:

- **Frontend**: Vite dev server serves the React app with hot module replacement
- **Backend**: Express server handles API requests, authentication, and AI processing
- **Communication**: Frontend makes authenticated API calls to the backend
- **Security**: API keys and sensitive operations stay server-side only

## Development Notes

### Security
- API keys are only accessible server-side
- All API routes require authentication
- Row-level security enabled on database
- CORS configured for client-server communication

### Email Integration
Currently uses mock email data. To connect real Gmail:
1. Set up OAuth 2.0 credentials in Google Cloud Console
2. Implement OAuth flow in server
3. Replace mock data in `server/services/gmail.ts`

### Canvas Integration
The app fetches Canvas assignments via publicly accessible iCal feeds. Users enter their Canvas iCal URL during onboarding.

## Contributing

Issues and pull requests are welcome! Please ensure:
- Code follows TypeScript best practices
- Components are properly typed
- API routes include error handling
- Security best practices are maintained

## License

See [LICENSE](LICENSE) file for details.

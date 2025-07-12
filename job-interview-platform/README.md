# Global Job & Interview Platform

A comprehensive platform for finding remote jobs and practicing interviews with AI-powered feedback.

## Features

### 🎯 Job Board Integration

- **Multi-source job aggregation** from RemoteOK and Remotive APIs
- **Advanced filtering** by keywords, category, location, and remote status
- **Job pinning** with persistent storage in Supabase
- **Real-time job updates** from multiple sources

### 📄 AI Resume Analysis

- **PDF resume parsing** using pdf-parse library
- **AI-powered analysis** with Gemini API
- **Skill extraction** and experience summarization
- **Personalized interview questions** generation
- **Professional summary** creation

### 🎤 AI Interview Practice

- **Dynamic question generation** based on resume analysis
- **Voice input support** using Web Speech API
- **Real-time feedback** on clarity, accuracy, and tone
- **Interview history** tracking and progress monitoring
- **Score-based evaluation** system

### 🔐 Authentication & User Management

- **Supabase authentication** with Google, GitHub, and LinkedIn
- **User-specific data** storage and retrieval
- **Session management** and secure routing

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **AI Services**: Google Gemini API
- **Authentication**: Supabase Auth
- **File Processing**: pdf-parse
- **UI Components**: Lucide React icons
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd job-interview-platform
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key

# Job APIs (optional - for future enhancements)
REMOTE_OK_API_URL=https://remoteok.com/api
REMOTIVE_API_URL=https://remotive.com/api
```

### 3. Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project URL and anon key** from Settings > API
3. **Set up the database schema** by running the following SQL in the Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pinned_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL,
    job_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE TABLE IF NOT EXISTS public.resume_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_text TEXT NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    feedback JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS policies
ALTER TABLE public.pinned_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own pinned jobs" ON public.pinned_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pinned jobs" ON public.pinned_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pinned jobs" ON public.pinned_jobs
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own resume analysis" ON public.resume_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume analysis" ON public.resume_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own interview history" ON public.interview_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview history" ON public.interview_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Google Gemini API Setup

1. **Get a Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Add the API key** to your `.env.local` file

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication routes
│   ├── jobs/              # Job board page
│   ├── resume/            # Resume analysis page
│   ├── interview/         # Interview practice page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── Navbar.tsx         # Navigation component
│   ├── JobCard.tsx        # Job display component
│   └── JobFilters.tsx     # Job filtering component
└── lib/                   # Utility libraries
    ├── supabase.ts        # Supabase client configuration
    ├── ai.ts              # AI service integration
    ├── jobs.ts            # Job board service
    └── resume.ts          # Resume processing service
```

## Key Features Implementation

### Job Board

- **Real-time job fetching** from multiple APIs
- **Client-side filtering** with instant results
- **Job pinning** with Supabase persistence
- **Responsive design** for mobile and desktop

### Resume Analysis

- **PDF text extraction** using pdf-parse
- **AI-powered analysis** with structured output
- **Skill and experience extraction**
- **Personalized question generation**

### Interview Practice

- **Dynamic question selection** from generated pool
- **Voice input** using Web Speech API
- **AI feedback generation** with scoring
- **Session history** tracking

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** with automatic builds

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code comments

## Roadmap

- [ ] **Enhanced job search** with more sources
- [ ] **Resume builder** with templates
- [ ] **Video interview practice** with AI analysis
- [ ] **Job application tracking** system
- [ ] **Company reviews** and ratings
- [ ] **Mobile app** development
- [ ] **Multi-language support**
- [ ] **Advanced analytics** dashboard

# Supabase Database Setup

Your Supabase project has been created successfully! Here's how to set up the database schema:

## Project Details

- **Project Name**: Dustyspac's Project
- **Project URL**: https://szocnrmnmxyswasodhro.supabase.co
- **Project Reference ID**: szocnrmnmxyswasodhro

## Environment Variables

Your `.env.local` file has been configured with:

- Supabase URL and API keys
- Google Gemini API key
- Database password

## Database Schema Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your "job-interview-platform" project
3. Navigate to **SQL Editor** in the left sidebar
4. Copy the contents of `supabase-schema.sql` file
5. Paste it into the SQL editor and click **Run**

### Option 2: Using Supabase CLI

If you have Docker running and want to use the CLI:

```bash
# Link your project (you'll need to enter your database password)
npx supabase link --project-ref szocnrmnmxyswasodhro

# Apply the schema
npx supabase db push
```

## Database Schema Overview

The schema includes the following tables:

1. **profiles** - User profiles (extends Supabase auth)
2. **jobs** - Job listings from various sources
3. **resumes** - User uploaded resumes with AI analysis
4. **interviews** - Interview sessions with AI feedback
5. **applications** - Job applications tracking

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- Users can only access their own data
- Jobs are publicly readable
- Proper authentication checks for all operations

## Next Steps

1. Apply the database schema using one of the methods above
2. Start the development server: `npm run dev`
3. Test the authentication and features
4. Upload some sample jobs to test the job board

## Troubleshooting

If you encounter any issues:

1. Check that your environment variables are correctly set
2. Verify the Supabase project is active
3. Ensure the database schema has been applied
4. Check the browser console for any errors

## API Keys Security

Remember to:

- Never commit `.env.local` to version control
- Keep your API keys secure
- Use environment variables in production

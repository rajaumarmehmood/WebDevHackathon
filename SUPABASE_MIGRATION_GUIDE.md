# Supabase Migration Guide

## Overview

The application has been migrated from in-memory storage to Supabase for persistent data storage. This means your resume data, job matches, and interview preps will now be saved permanently in the database.

## What Changed

### Before (In-Memory Storage)
- Data was stored in JavaScript Maps
- Data was lost on server restart or page refresh
- No persistence between sessions

### After (Supabase Storage)
- Data is stored in PostgreSQL database
- Data persists across sessions and server restarts
- Proper user data isolation with Row Level Security (RLS)

## Database Setup

### 1. Run the Schema

The database schema is already defined in `supabase/schema.sql`. To set it up:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/schema.sql`
4. Run the SQL script

This will create:
- `profiles` table - User profile information
- `resumes` table - Resume data and AI analysis
- `interview_preps` table - Interview preparation materials
- `job_applications` table - Job matches and application status

### 2. Verify Tables

After running the schema, verify the tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- profiles
- resumes
- interview_preps
- job_applications

### 3. Check Row Level Security

Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

## Files Modified

### New Files
- `src/lib/dataStoreSupabase.ts` - New Supabase-backed data store

### Updated Files
- `src/app/api/resume/upload/route.ts` - Uses Supabase dataStore
- `src/app/api/jobs/discover/route.ts` - Uses Supabase dataStore
- `src/app/api/interview/generate/route.ts` - Uses Supabase dataStore
- `src/app/api/analytics/route.ts` - Uses Supabase dataStore

### Deprecated Files
- `src/lib/dataStore.ts` - Old in-memory implementation (kept for reference)

## API Changes

All dataStore methods are now async and return Promises:

### Before
```typescript
const resume = dataStore.getResume(userId);
dataStore.saveResume(resumeData);
```

### After
```typescript
const resume = await dataStore.getResume(userId);
await dataStore.saveResume(resumeData);
```

## Testing the Migration

### 1. Upload a Resume
1. Navigate to the upload resume page
2. Upload a PDF resume
3. Verify it's analyzed successfully

### 2. Check Database
Go to Supabase dashboard → Table Editor → `resumes` table
You should see your resume data with the analysis JSON.

### 3. Navigate Away and Back
1. Go to another page (e.g., Job Matches)
2. Return to the Dashboard
3. Your resume data should still be there!

### 4. Restart the Server
1. Stop the dev server
2. Start it again with `npm run dev`
3. Your data should persist

## Data Structure

### Resumes Table
```typescript
{
  id: UUID,
  user_id: UUID,
  file_name: string,
  file_url: string | null,
  analysis: {
    name: string,
    email: string,
    phone: string,
    skills: string[],
    experience: Array<{
      title: string,
      company: string,
      duration: string,
      description: string
    }>,
    education: Array<{
      degree: string,
      school: string,
      year: string
    }>,
    projects: Array<{
      name: string,
      description: string,
      tech: string[]
    }>,
    summary: string,
    proficiencyLevel: string,
    yearsOfExperience: number
  },
  created_at: timestamp,
  updated_at: timestamp
}
```

### Job Applications Table
```typescript
{
  id: UUID,
  user_id: UUID,
  job_title: string,
  company: string,
  location: string,
  salary_range: string | null,
  match_score: number,
  status: 'new' | 'saved' | 'applied' | 'interviewing' | 'rejected',
  applied_at: timestamp | null,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Interview Preps Table
```typescript
{
  id: UUID,
  user_id: UUID,
  company: string,
  role: string,
  technologies: string[],
  prep_material: {
    companyInsights: object,
    technicalQuestions: array,
    behavioralQuestions: array,
    studyGuide: array
  },
  created_at: timestamp,
  updated_at: timestamp
}
```

## Troubleshooting

### Data Not Persisting

1. **Check Supabase Connection**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env`
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`

2. **Check RLS Policies**
   - Ensure you're logged in with a valid user
   - Check that RLS policies allow the operation

3. **Check Console Logs**
   - Look for Supabase errors in server console
   - Check browser console for client-side errors

### Permission Errors

If you see "permission denied" errors:

1. Verify RLS policies are set up correctly
2. Check that `auth.uid()` matches the `user_id` in the data
3. Ensure the user is authenticated

### Migration from Old Data

If you had data in the old in-memory store:
- That data is lost (it was never persisted)
- You'll need to re-upload your resume
- Job matches and interview preps will need to be regenerated

## Benefits of Supabase Storage

1. **Persistence** - Data survives server restarts
2. **Security** - Row Level Security protects user data
3. **Scalability** - PostgreSQL can handle millions of records
4. **Real-time** - Can add real-time subscriptions later
5. **Backup** - Supabase provides automatic backups
6. **Multi-device** - Access your data from any device

## Next Steps

1. Run the schema in Supabase SQL Editor
2. Test the resume upload feature
3. Verify data persists in the database
4. Monitor for any errors in production

## Support

If you encounter issues:
1. Check the Supabase dashboard for errors
2. Review the server logs
3. Verify environment variables are set correctly
4. Ensure the database schema is properly set up

# Automatic Job Matching Implementation Guide

## Overview

The system now automatically searches and matches jobs after resume upload using the SERP API (Google Jobs). When a user uploads their resume, the system:

1. Extracts text from PDF
2. Analyzes resume with Gemini AI
3. **Automatically searches for jobs using SERP API**
4. **Matches jobs to user profile with AI**
5. **Saves matched jobs to database**
6. User can view matched jobs on the Jobs page

## Implementation Details

### 1. SERP API Integration

**File**: `src/lib/jobSearch.ts`

The `searchJobs()` function now uses SERP API to fetch real job listings from Google Jobs:

```typescript
export async function searchJobs(
  skills: string[],
  location: string = 'Remote',
  limit: number = 20
): Promise<Job[]>
```

**Features**:
- Uses top 3 skills from resume to create search query
- Searches Google Jobs via SERP API
- Extracts job details: title, company, location, salary, description
- Parses requirements from job descriptions
- Falls back to mock data if API fails or key is missing

**API Call**:
```typescript
const response = await axios.get('https://serpapi.com/search.json', {
  params: {
    engine: 'google_jobs',
    q: `${topSkills} jobs ${location}`,
    location: location,
    api_key: SERP_API_KEY,
    num: limit,
  }
});
```

### 2. Automatic Job Matching After Resume Upload

**File**: `src/app/api/resume/upload/route.ts`

After successful resume analysis, the system automatically:

```typescript
// 1. Search for jobs using SERP API
const jobs = await searchJobs(skills, 'Remote', 20);

// 2. Match jobs to profile using AI
const matches = await matchJobsToProfile(
  skills,
  yearsOfExperience,
  proficiencyLevel,
  jobs
);

// 3. Create job matches with scores
const jobMatches: JobMatch[] = jobs.map((job, index) => {
  const match = matches.find((m: any) => m.jobId === job.id) || {
    matchScore: 50,
    matchReasons: ['General match based on profile'],
  };

  return {
    id: `match-${Date.now()}-${index}`,
    userId,
    jobId: job.id,
    job,
    matchScore: match.matchScore,
    matchReasons: match.matchReasons,
    createdAt: new Date(),
    status: 'new' as const,
  };
});

// 4. Sort by match score (highest first)
jobMatches.sort((a, b) => b.matchScore - a.matchScore);

// 5. Save to database
await dataStore.saveJobMatches(userId, jobMatches);
```

### 3. Job Matches Page

**File**: `src/app/dashboard/jobs/page.tsx`

The Jobs page automatically fetches and displays matched jobs:

```typescript
const fetchJobs = async () => {
  const response = await fetch(`/api/jobs/discover?userId=${user.id}`);
  const data = await response.json();
  
  if (data.success) {
    setJobs(data.data);
  }
};
```

**Features**:
- Displays all matched jobs sorted by match score
- Shows match percentage with color coding
- Displays job details: title, company, location, salary
- Shows match reasons
- Allows filtering and searching
- "Discover New Jobs" button to refresh matches

## Data Flow

```
User uploads PDF
    ↓
Extract text from PDF
    ↓
Analyze with Gemini AI
    ↓
Extract: skills, experience, proficiency
    ↓
Search jobs with SERP API
  - Query: "React TypeScript Node.js jobs Remote"
  - Returns: 20 real job listings from Google Jobs
    ↓
Match jobs to profile with AI
  - Calculate match score (0-100)
  - Generate match reasons
    ↓
Save to database
  - job_applications table
  - Includes: job details, match score, status
    ↓
User navigates to Jobs page
    ↓
Fetch matched jobs from database
    ↓
Display jobs sorted by match score
```

## SERP API Configuration

### API Key Setup

The SERP API key is already configured in `.env`:
```
SERP_API_KEY=b36318288e79450a5bf73fc0589859a9772b4a6e137918127097e1e53eb5ea9c
```

### API Limits

- **Free Plan**: 100 searches/month
- **Paid Plans**: Starting at $50/month for 5,000 searches

### Search Parameters

```javascript
{
  engine: 'google_jobs',      // Use Google Jobs search
  q: 'React jobs Remote',     // Search query
  location: 'Remote',         // Job location
  api_key: SERP_API_KEY,      // Your API key
  num: 20                     // Number of results
}
```

## Job Matching Algorithm

### 1. Search Query Generation

Takes top 3 skills from resume:
```typescript
const topSkills = skills.slice(0, 3).join(' ');
const query = `${topSkills} jobs ${location}`;
// Example: "React TypeScript Node.js jobs Remote"
```

### 2. AI-Powered Matching

Uses Gemini AI to calculate match scores:

```typescript
const matches = await matchJobsToProfile(
  skills,              // User's skills
  yearsOfExperience,   // Years of experience
  proficiencyLevel,    // Entry/Junior/Mid/Senior/Lead
  jobs                 // Job listings
);
```

**AI considers**:
- Skill overlap (how many required skills user has)
- Experience level match (entry vs senior)
- Role seniority alignment
- Technology stack compatibility

### 3. Match Score Interpretation

- **90-100**: Excellent match (green)
- **80-89**: Good match (blue)
- **70-79**: Fair match (yellow)
- **Below 70**: Weak match (gray)

## Database Schema

### job_applications Table

```sql
CREATE TABLE job_applications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_range TEXT,
  match_score INTEGER NOT NULL,
  status TEXT DEFAULT 'new',
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Status Values**:
- `new` - Just discovered
- `viewed` - User viewed the job
- `saved` - User saved for later
- `applied` - User applied
- `interviewing` - In interview process
- `rejected` - Application rejected

## Testing the Feature

### Test 1: Upload Resume and Auto-Match

1. Navigate to `/dashboard/upload-resume`
2. Upload a PDF resume with clear skills (e.g., React, TypeScript, Node.js)
3. Wait for analysis to complete
4. Check server logs - should see:
   ```
   Searching for matching jobs...
   Found 20 jobs
   Matching jobs to profile with AI...
   Saved 20 job matches
   ```
5. Navigate to `/dashboard/jobs`
6. Should see matched jobs sorted by match score

### Test 2: Verify SERP API Integration

Check server logs for:
```
Searching jobs with SERP API: "React TypeScript Node.js jobs Remote"
Found 20 jobs from SERP API
```

If you see:
```
SERP_API_KEY not configured, using mock data
```
Then the API key is not set correctly.

### Test 3: Check Database

Go to Supabase Dashboard → Table Editor → job_applications

You should see:
- Multiple rows for your user_id
- job_title, company, location filled in
- match_score between 0-100
- status = 'new'

### Test 4: Match Score Accuracy

1. Upload a resume with specific skills (e.g., React, Python, AWS)
2. Check matched jobs
3. Jobs requiring those skills should have higher match scores
4. Jobs with different tech stacks should have lower scores

## Troubleshooting

### No Jobs Found

**Symptoms**: Jobs page is empty after resume upload

**Check**:
1. Server logs for errors
2. SERP API key is valid
3. Resume has extractable skills
4. Network connectivity

**Solution**:
```bash
# Test SERP API directly
curl "https://serpapi.com/search.json?engine=google_jobs&q=developer+jobs&api_key=YOUR_KEY"
```

### Mock Data Instead of Real Jobs

**Symptoms**: Jobs look generic/templated

**Check**:
1. `.env` file has SERP_API_KEY
2. Server logs show "using mock data"

**Solution**:
- Verify API key is correct
- Check API quota hasn't been exceeded
- Restart dev server after adding API key

### Low Match Scores

**Symptoms**: All jobs show low match scores (<50)

**Check**:
1. Resume has clear, extractable skills
2. AI analysis extracted skills correctly
3. Job descriptions contain relevant keywords

**Solution**:
- Ensure resume has technical skills listed
- Use industry-standard skill names
- Check Gemini AI analysis output

### Jobs Not Persisting

**Symptoms**: Jobs disappear after page refresh

**Check**:
1. Supabase connection is working
2. job_applications table exists
3. RLS policies allow inserts

**Solution**:
- Run the schema from `supabase/schema.sql`
- Check Supabase logs for errors
- Verify user is authenticated

## Performance Considerations

### Resume Upload Time

- **PDF Parsing**: ~2-3 seconds
- **AI Analysis**: ~5-10 seconds
- **Job Search (SERP API)**: ~2-3 seconds
- **AI Matching**: ~3-5 seconds
- **Database Save**: <1 second

**Total**: ~15-25 seconds for complete flow

### Optimization Tips

1. **Parallel Processing**: Job search and matching could be done in background
2. **Caching**: Cache job results for 1 hour
3. **Batch Processing**: Process multiple users' job searches together
4. **Rate Limiting**: Limit job searches to prevent API quota exhaustion

## API Costs

### SERP API Pricing

- **Free**: 100 searches/month
- **Starter**: $50/month for 5,000 searches
- **Professional**: $250/month for 30,000 searches

### Cost Per User

- 1 resume upload = 1 SERP API search
- Average: $0.01 per job search (on Starter plan)

### Cost Optimization

1. **Cache Results**: Store job listings for 24 hours
2. **Batch Updates**: Update all users' jobs once per day
3. **Smart Refresh**: Only search when resume changes
4. **Fallback**: Use mock data when quota exceeded

## Future Enhancements

1. **Location Preferences**: Allow users to set preferred locations
2. **Job Alerts**: Email notifications for new high-match jobs
3. **Application Tracking**: Track application status
4. **Company Research**: Fetch company info from SERP API
5. **Salary Insights**: Show salary trends for roles
6. **Interview Prep**: Auto-generate prep for applied jobs
7. **Job Recommendations**: ML-based recommendations
8. **Multiple Sources**: Integrate LinkedIn, Indeed, etc.

## Security & Privacy

1. **API Key**: Stored securely in environment variables
2. **User Data**: RLS ensures users only see their jobs
3. **Rate Limiting**: Prevent API abuse
4. **Data Retention**: Jobs older than 30 days can be archived
5. **PII Protection**: No personal info sent to SERP API

## Conclusion

The automatic job matching feature provides users with:
- ✅ Real job listings from Google Jobs
- ✅ AI-powered match scoring
- ✅ Automatic discovery after resume upload
- ✅ Persistent storage in database
- ✅ Easy access via Jobs page

Users no longer need to manually search for jobs - the system does it automatically based on their resume!

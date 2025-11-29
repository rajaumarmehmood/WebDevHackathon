# Jobs JSON Export Feature

## Overview

When a resume is uploaded and analyzed, the system now automatically saves all matched jobs to a JSON file in Supabase Storage. This provides:

1. **Complete job listings backup** - All jobs with full descriptions
2. **Easy export** - Download and share job listings
3. **Historical record** - Track jobs over time
4. **Offline access** - View jobs without database connection

## JSON File Structure

### File Location

```
Supabase Storage → Resume bucket
└── {userId}/
    ├── {userId}-{timestamp}.pdf          (Resume PDF)
    └── jobs-{timestamp}.json             (Jobs JSON) ← NEW!
```

### File Naming

- **Format**: `jobs-{timestamp}.json`
- **Example**: `jobs-1732875234567.json`
- **Location**: Same folder as user's resume

### JSON Structure

```json
{
  "userId": "user-123-abc",
  "generatedAt": "2025-11-29T10:30:00.000Z",
  "resumeFileName": "John_Doe_Resume.pdf",
  "userProfile": {
    "skills": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "AWS"
    ],
    "yearsOfExperience": 5,
    "proficiencyLevel": "Senior"
  },
  "totalJobs": 20,
  "jobs": [
    {
      "id": "match-1732875234567-0",
      "jobId": "job-abc123",
      "title": "Senior React Developer",
      "company": "TechCorp Inc",
      "location": "Remote",
      "description": "We are looking for an experienced React developer to join our team. You will work on building modern web applications using React, TypeScript, and Next.js. The ideal candidate has 5+ years of experience in frontend development and strong problem-solving skills. You'll collaborate with designers and backend engineers to create seamless user experiences.",
      "requirements": [
        "React",
        "TypeScript",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Git"
      ],
      "salary": "$120,000-$160,000 a year",
      "type": "Full-time",
      "posted": "2025-11-27T10:00:00.000Z",
      "url": "https://www.google.com/search?q=Senior+React+Developer+TechCorp",
      "source": "Google Jobs (SERP API)",
      "tags": [
        "React",
        "TypeScript",
        "Remote"
      ],
      "matchScore": 92,
      "matchReasons": [
        "Strong match on React and TypeScript skills",
        "Experience level aligns with senior position",
        "Remote work preference matches job location",
        "Salary range fits your experience level",
        "Tech stack matches your expertise"
      ],
      "status": "new",
      "createdAt": "2025-11-29T10:30:00.000Z"
    },
    {
      "id": "match-1732875234567-1",
      "jobId": "job-def456",
      "title": "Full Stack Engineer",
      "company": "StartupXYZ",
      "location": "San Francisco, CA",
      "description": "Join our fast-growing startup as a Full Stack Engineer. You'll work on both frontend and backend systems, building scalable applications that serve millions of users. We use React, Node.js, and PostgreSQL. Looking for someone who can take ownership of features from design to deployment.",
      "requirements": [
        "React",
        "Node.js",
        "PostgreSQL",
        "TypeScript",
        "Docker",
        "Kubernetes"
      ],
      "salary": "$130,000-$180,000 a year",
      "type": "Full-time",
      "posted": "2025-11-26T15:00:00.000Z",
      "url": "https://www.google.com/search?q=Full+Stack+Engineer+StartupXYZ",
      "source": "Google Jobs (SERP API)",
      "tags": [
        "React",
        "Node.js",
        "PostgreSQL"
      ],
      "matchScore": 88,
      "matchReasons": [
        "Excellent match on full stack skills",
        "You have experience with all core technologies",
        "Startup environment matches your preferences",
        "Competitive salary for your experience level"
      ],
      "status": "new",
      "createdAt": "2025-11-29T10:30:00.000Z"
    }
    // ... 18 more jobs
  ]
}
```

## Data Included

### User Profile Section

```json
"userProfile": {
  "skills": ["React", "TypeScript", "Node.js"],
  "yearsOfExperience": 5,
  "proficiencyLevel": "Senior"
}
```

**Purpose**: Shows what criteria were used for job matching

### Job Details (for each job)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique match ID | "match-1732875234567-0" |
| `jobId` | string | Job listing ID | "job-abc123" |
| `title` | string | Job title | "Senior React Developer" |
| `company` | string | Company name | "TechCorp Inc" |
| `location` | string | Job location | "Remote" |
| `description` | string | **Full job description** | "We are looking for..." |
| `requirements` | array | Technical skills needed | ["React", "TypeScript"] |
| `salary` | string | Salary range | "$120k-$160k" |
| `type` | string | Employment type | "Full-time" |
| `posted` | string | When job was posted | "2025-11-27T10:00:00Z" |
| `url` | string | Link to job posting | "https://..." |
| `source` | string | Where job came from | "Google Jobs (SERP API)" |
| `tags` | array | Key technologies | ["React", "TypeScript"] |
| `matchScore` | number | Match percentage | 92 |
| `matchReasons` | array | **Why it matches** | ["Strong match on..."] |
| `status` | string | Application status | "new" |
| `createdAt` | string | When match was created | "2025-11-29T10:30:00Z" |

## Use Cases

### 1. Backup & Archive

**Scenario**: Keep historical record of job searches

**Benefit**: 
- Track how job market changes over time
- Compare jobs from different time periods
- See which companies were hiring when

### 2. Offline Access

**Scenario**: Review jobs without internet

**Benefit**:
- Download JSON file
- Open in any text editor or JSON viewer
- Review job descriptions offline

### 3. Data Analysis

**Scenario**: Analyze job market trends

**Benefit**:
- Parse JSON with scripts
- Analyze salary ranges
- Identify common requirements
- Track match scores

### 4. Sharing

**Scenario**: Share job listings with career counselor

**Benefit**:
- Send single JSON file
- Contains all job details
- Easy to review and discuss

### 5. Integration

**Scenario**: Import into other tools

**Benefit**:
- Standard JSON format
- Easy to parse programmatically
- Can feed into other applications

## Accessing JSON Files

### Method 1: Supabase Dashboard

1. Go to Supabase Dashboard
2. Navigate to **Storage** → **Resume** bucket
3. Open your user folder (by user ID)
4. Find `jobs-{timestamp}.json` files
5. Click to download

### Method 2: Public URL

Each JSON file has a public URL:

```
https://[project-ref].supabase.co/storage/v1/object/public/Resume/[user-id]/jobs-[timestamp].json
```

You can:
- Open in browser
- Download directly
- Share the link

### Method 3: API Endpoint (Future)

Create an API endpoint to list and download JSON files:

```typescript
// GET /api/jobs/exports?userId={userId}
// Returns list of all JSON exports for user
```

## Example Usage

### Download and View

```bash
# Download JSON file
curl -o my-jobs.json "https://[project].supabase.co/storage/v1/object/public/Resume/[user-id]/jobs-[timestamp].json"

# Pretty print
cat my-jobs.json | jq '.'

# Count jobs
cat my-jobs.json | jq '.totalJobs'

# List job titles
cat my-jobs.json | jq '.jobs[].title'

# Filter high-match jobs (90%+)
cat my-jobs.json | jq '.jobs[] | select(.matchScore >= 90)'
```

### Parse with JavaScript

```javascript
// Fetch and parse JSON
const response = await fetch('https://[project].supabase.co/storage/v1/object/public/Resume/[user-id]/jobs-[timestamp].json');
const jobsData = await response.json();

console.log(`Total jobs: ${jobsData.totalJobs}`);
console.log(`User skills: ${jobsData.userProfile.skills.join(', ')}`);

// Filter by match score
const excellentMatches = jobsData.jobs.filter(job => job.matchScore >= 90);
console.log(`Excellent matches: ${excellentMatches.length}`);

// Group by company
const byCompany = jobsData.jobs.reduce((acc, job) => {
  acc[job.company] = (acc[job.company] || 0) + 1;
  return acc;
}, {});
console.log('Jobs by company:', byCompany);
```

### Parse with Python

```python
import json
import requests

# Fetch JSON
url = "https://[project].supabase.co/storage/v1/object/public/Resume/[user-id]/jobs-[timestamp].json"
response = requests.get(url)
jobs_data = response.json()

print(f"Total jobs: {jobs_data['totalJobs']}")
print(f"User skills: {', '.join(jobs_data['userProfile']['skills'])}")

# Analyze salary ranges
salaries = [job['salary'] for job in jobs_data['jobs'] if job['salary']]
print(f"Jobs with salary info: {len(salaries)}")

# Find remote jobs
remote_jobs = [job for job in jobs_data['jobs'] if 'Remote' in job['location']]
print(f"Remote jobs: {len(remote_jobs)}")

# Average match score
avg_score = sum(job['matchScore'] for job in jobs_data['jobs']) / len(jobs_data['jobs'])
print(f"Average match score: {avg_score:.1f}%")
```

## File Management

### Automatic Cleanup (Future Enhancement)

Consider implementing:

```typescript
// Delete JSON files older than 30 days
async function cleanupOldJobExports(userId: string) {
  const supabase = await createClient();
  
  const { data: files } = await supabase.storage
    .from('Resume')
    .list(`${userId}/`);
  
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  const oldJsonFiles = files
    ?.filter(file => file.name.startsWith('jobs-') && file.name.endsWith('.json'))
    .filter(file => {
      const timestamp = parseInt(file.name.match(/jobs-(\d+)\.json/)?.[1] || '0');
      return timestamp < thirtyDaysAgo;
    });
  
  // Delete old files
  for (const file of oldJsonFiles || []) {
    await supabase.storage
      .from('Resume')
      .remove([`${userId}/${file.name}`]);
  }
}
```

### Storage Considerations

- **File Size**: ~50-100KB per JSON file (20 jobs)
- **Storage Cost**: Minimal (Supabase free tier: 1GB)
- **Retention**: Keep last 3-6 months
- **Cleanup**: Implement automatic deletion of old files

## Benefits Summary

✅ **Complete Backup**
- All job details saved
- Full descriptions included
- Match reasons preserved

✅ **Easy Access**
- Public URLs
- Download anytime
- No database queries needed

✅ **Portable Format**
- Standard JSON
- Works with any tool
- Easy to parse

✅ **Historical Record**
- Track job searches over time
- Compare different periods
- Analyze trends

✅ **Offline Capability**
- Download and review offline
- No internet needed
- Share via file

✅ **Integration Ready**
- Parse with any language
- Feed into other tools
- Automate workflows

## Testing

### 1. Upload Resume

Upload a resume and wait for processing

### 2. Check Storage

Go to Supabase Storage → Resume → Your user folder

You should see:
- `{userId}-{timestamp}.pdf` (Resume)
- `jobs-{timestamp}.json` (Jobs) ← NEW!

### 3. Download JSON

Click on the JSON file to download

### 4. Verify Content

Open in text editor or JSON viewer

Should contain:
- ✅ User profile (skills, experience)
- ✅ 20 jobs with full details
- ✅ Descriptions for each job
- ✅ Match reasons for each job
- ✅ All metadata

### 5. Parse and Analyze

Try parsing with jq, JavaScript, or Python

## Conclusion

The JSON export feature provides a complete, portable backup of all matched jobs with their full descriptions and match reasons. Users can:

- 📥 Download their job listings anytime
- 📊 Analyze job market trends
- 📤 Share with career counselors
- 💾 Keep historical records
- 🔌 Integrate with other tools

All job data is preserved in an easy-to-use, standard format! 🎉

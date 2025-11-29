# Job Search Location Configuration Guide

## Current Location Settings

### Where Location is Used

The system uses location in **2 places**:

#### 1. Automatic Job Search (After Resume Upload)
**File**: `src/app/api/resume/upload/route.ts`

```typescript
// Line 114
const jobs = await searchJobs(skills, 'Remote', 20);
                                      ^^^^^^^^
                                      HARDCODED!
```

**Current Setting**: `'Remote'`
- This is **hardcoded** and always searches for remote jobs
- Converted to `'United States'` for SERP API compatibility

#### 2. Manual Job Discovery (Discover New Jobs Button)
**File**: `src/app/api/jobs/discover/route.ts`

```typescript
// Line 11
const { userId, location = 'Remote', limit = 20 } = body;
                         ^^^^^^^^
                         DEFAULT VALUE

// Line 32
const jobs = await searchJobs(skills, location, limit);
```

**Current Setting**: `'Remote'` (default)
- Can be overridden by passing `location` in request body
- Falls back to `'Remote'` if not provided

### How Location is Processed

**File**: `src/lib/jobSearch.ts`

```typescript
// SERP API doesn't support "Remote" as location
// So we convert it to "United States"
const searchLocation = location === 'Remote' ? 'United States' : location;

const response = await axios.get(SERP_API_URL, {
  params: {
    engine: 'google_jobs',
    q: query,                    // "React TypeScript jobs Remote"
    location: searchLocation,    // "United States" (not "Remote")
    api_key: SERP_API_KEY,
    num: limit,
  }
});
```

**Why the conversion?**
- SERP API doesn't accept `"Remote"` as a valid location
- Returns error: `"Unsupported 'Remote' location"`
- Solution: Use `"United States"` which returns remote jobs too

## Location Options

### Supported Locations

SERP API accepts these location formats:

#### 1. Country Names
```javascript
'United States'
'Canada'
'United Kingdom'
'Australia'
'Germany'
```

#### 2. City Names
```javascript
'San Francisco, CA'
'New York, NY'
'Austin, TX'
'Seattle, WA'
'Boston, MA'
```

#### 3. State Names
```javascript
'California'
'Texas'
'New York'
'Florida'
```

#### 4. Special Keywords
```javascript
'Anywhere'        // Works!
'United States'   // Works!
'Remote'          // Doesn't work (we convert it)
```

### Current Behavior

| User Action | Location Used | SERP API Receives | Jobs Returned |
|-------------|---------------|-------------------|---------------|
| Upload resume | `'Remote'` (hardcoded) | `'United States'` | US + Remote jobs |
| Click "Discover New Jobs" | `'Remote'` (default) | `'United States'` | US + Remote jobs |
| API call with location | Custom location | As provided | Location-specific |

## How to Change Location

### Option 1: Change Default Location (Hardcoded)

**For Resume Upload**:

Edit `src/app/api/resume/upload/route.ts`:

```typescript
// Current
const jobs = await searchJobs(skills, 'Remote', 20);

// Change to specific location
const jobs = await searchJobs(skills, 'San Francisco, CA', 20);

// Or use a different country
const jobs = await searchJobs(skills, 'Canada', 20);
```

**For Discover Jobs**:

Edit `src/app/api/jobs/discover/route.ts`:

```typescript
// Current
const { userId, location = 'Remote', limit = 20 } = body;

// Change default
const { userId, location = 'San Francisco, CA', limit = 20 } = body;
```

### Option 2: Add Location Preference to User Profile

**Step 1**: Add location to resume analysis

Edit `src/lib/types.ts`:

```typescript
export interface ResumeAnalysis {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  summary?: string;
  proficiencyLevel: string;
  yearsOfExperience: number;
  preferredLocation?: string;  // ← ADD THIS
}
```

**Step 2**: Extract location from resume

Edit `src/lib/gemini.ts`:

```typescript
const prompt = `
Analyze the following resume and extract structured information in JSON format.
Extract: name, email, phone, skills, experience, education, projects, 
summary, proficiencyLevel, yearsOfExperience, preferredLocation.

If the resume mentions location preferences (e.g., "Looking for remote work" or 
"Open to opportunities in San Francisco"), extract it as preferredLocation.

Resume text:
${resumeText}
`;
```

**Step 3**: Use preferred location in job search

Edit `src/app/api/resume/upload/route.ts`:

```typescript
// Use user's preferred location if available
const searchLocation = analysis.preferredLocation || 'Remote';
const jobs = await searchJobs(skills, searchLocation, 20);
```

### Option 3: Add Location Selector in UI

**Step 1**: Add location selector to upload page

Edit `src/app/dashboard/upload-resume/page.tsx`:

```typescript
const [preferredLocation, setPreferredLocation] = useState('Remote');

// Add UI element
<select 
  value={preferredLocation}
  onChange={(e) => setPreferredLocation(e.target.value)}
  className="..."
>
  <option value="Remote">Remote</option>
  <option value="United States">United States</option>
  <option value="San Francisco, CA">San Francisco, CA</option>
  <option value="New York, NY">New York, NY</option>
  <option value="Austin, TX">Austin, TX</option>
  <option value="Seattle, WA">Seattle, WA</option>
  <option value="Canada">Canada</option>
  <option value="United Kingdom">United Kingdom</option>
</select>

// Pass to API
formData.append('preferredLocation', preferredLocation);
```

**Step 2**: Use in API

Edit `src/app/api/resume/upload/route.ts`:

```typescript
const preferredLocation = formData.get('preferredLocation') as string || 'Remote';
const jobs = await searchJobs(skills, preferredLocation, 20);
```

### Option 4: Add Location Filter on Jobs Page

**Step 1**: Add location filter

Edit `src/app/dashboard/jobs/page.tsx`:

```typescript
const [locationFilter, setLocationFilter] = useState('all');

// Add UI
<select
  value={locationFilter}
  onChange={(e) => setLocationFilter(e.target.value)}
>
  <option value="all">All Locations</option>
  <option value="Remote">Remote Only</option>
  <option value="San Francisco">San Francisco</option>
  <option value="New York">New York</option>
</select>

// Filter jobs
const filteredJobs = jobs.filter(job => {
  if (locationFilter === 'all') return true;
  if (locationFilter === 'Remote') {
    return job.job.location.toLowerCase().includes('remote') ||
           job.job.location.toLowerCase().includes('anywhere');
  }
  return job.job.location.includes(locationFilter);
});
```

## Location in Search Query

The location is used in **2 ways**:

### 1. Search Query String
```javascript
const query = `${topSkills} jobs ${location}`;
// Example: "React TypeScript Node.js jobs Remote"
```

### 2. SERP API Location Parameter
```javascript
params: {
  q: 'React TypeScript Node.js jobs Remote',
  location: 'United States',  // ← Separate parameter
}
```

**Result**: Jobs that match skills AND are in/near the location

## Examples

### Example 1: Remote Jobs Only
```javascript
searchJobs(['React', 'TypeScript'], 'Remote', 20)
  ↓
SERP API Query:
  q: "React TypeScript jobs Remote"
  location: "United States"
  ↓
Returns: Remote jobs in US
```

### Example 2: San Francisco Jobs
```javascript
searchJobs(['React', 'TypeScript'], 'San Francisco, CA', 20)
  ↓
SERP API Query:
  q: "React TypeScript jobs San Francisco, CA"
  location: "San Francisco, CA"
  ↓
Returns: Jobs in San Francisco area
```

### Example 3: Canada Jobs
```javascript
searchJobs(['Python', 'Django'], 'Canada', 20)
  ↓
SERP API Query:
  q: "Python Django jobs Canada"
  location: "Canada"
  ↓
Returns: Jobs in Canada
```

## Testing Different Locations

### Test via API

```bash
# Test with different locations
curl -X POST http://localhost:3000/api/jobs/discover \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id",
    "location": "San Francisco, CA",
    "limit": 10
  }'
```

### Test via Code

```javascript
// Test different locations
const locations = [
  'Remote',
  'San Francisco, CA',
  'New York, NY',
  'Canada',
  'United Kingdom'
];

for (const location of locations) {
  const jobs = await searchJobs(['React'], location, 5);
  console.log(`${location}: ${jobs.length} jobs found`);
}
```

## Recommendations

### For Most Users
**Use**: `'Remote'` (converted to `'United States'`)
- Returns remote jobs
- Includes US-based positions
- Largest job pool

### For Location-Specific Search
**Use**: City or state name
- Example: `'San Francisco, CA'`
- Returns local jobs
- More relevant for relocation

### For International Users
**Use**: Country name
- Example: `'Canada'`, `'United Kingdom'`
- Returns jobs in that country
- Better for visa/work permit considerations

## Current Configuration Summary

✅ **Resume Upload**: Hardcoded to `'Remote'`
✅ **Discover Jobs**: Default `'Remote'`, can be overridden
✅ **SERP API**: Converts `'Remote'` → `'United States'`
✅ **Job Results**: Mix of remote and US-based jobs

### To Change:
1. Edit `src/app/api/resume/upload/route.ts` line 114
2. Change `'Remote'` to your preferred location
3. Or implement user preference system

Would you like me to implement a location preference feature where users can select their preferred location?

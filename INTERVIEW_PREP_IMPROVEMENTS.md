# Interview Prep Improvements

## Changes Implemented

### 1. Job Description Expansion with "See More"

**Jobs Page (`src/app/dashboard/jobs/page.tsx`):**
- Job descriptions now truncate to 3-4 lines (~45 words)
- Added "See more" / "See less" toggle button with chevron icons
- Smooth expansion/collapse of full description
- Only shows toggle if description is longer than 45 words

**Implementation:**
- `truncateDescription()` function limits text to ~15 words per line × 3 lines
- `expandedDescriptions` state tracks which jobs are expanded
- `toggleDescription()` function manages expand/collapse

### 2. Interview Prep Button for Each Job

**Jobs Page:**
- Added "Interview Prep" button next to "View Job" button
- Uses GraduationCap icon for visual clarity
- Clicking navigates to interview prep page with pre-filled data

**Navigation:**
- Passes job title as `role` parameter
- Passes job tags as `technologies` parameter
- URL format: `/dashboard/interview-prep?role=Frontend Developer&technologies=React, TypeScript, Node.js`

### 3. Removed Company-Specific Information

**Interview Prep Page (`src/app/dashboard/interview-prep/page.tsx`):**
- Removed "Company Name" input field
- Form now only requires:
  - Role / Position
  - Key Technologies
- Pre-fills from URL parameters when navigating from jobs page

**Updated Labels:**
- "Company Insights" → "Role Insights"
- "Culture" → "Overview"
- "Tech Stack" → "Key Technologies"
- "Interview Process" → "Typical Interview Process"
- "Tips" → "Preparation Tips"

**Success Message:**
- Changed from "Personalized for {role} at {company}"
- To "Personalized for {role} position"

### 4. General Interview Prep (Not Company-Specific)

**API Route (`src/app/api/interview/generate/route.ts`):**
- Created new API endpoint at `/api/interview/generate`
- Accepts: `userId`, `role`, `technologies`
- No longer requires `company` parameter
- Sets company to "General" in database

**Gemini AI (`src/lib/gemini.ts`):**
- Added `generateInterviewPrep()` function
- Generates general interview prep for role type
- Focuses on:
  - Industry best practices
  - Common interview patterns for the role
  - Technology-specific questions
  - General behavioral questions
- NOT company-specific information

**Prompt Changes:**
- Emphasizes "GENERAL interview prep for this role type"
- Asks for typical interview process, not company-specific
- Generates 8-10 technical questions (increased from 6-8)
- Generates 5-6 behavioral questions
- Generates 6-8 study guide items

## User Flow

1. **From Jobs Page:**
   - User sees job listing with truncated description
   - Clicks "See more" to read full description
   - Clicks "Interview Prep" button
   - Navigates to interview prep page with role and technologies pre-filled

2. **Interview Prep Generation:**
   - Form is pre-filled with job details
   - User can edit role or technologies if needed
   - Clicks "Generate Prep Material"
   - AI generates general interview prep (not company-specific)
   - User sees:
     - Role overview and typical interview process
     - Technical questions for the technologies
     - Behavioral questions with STAR framework
     - Study guide with resources

## Benefits

- **Better UX**: Job descriptions don't clutter the page
- **Quick Access**: One-click interview prep from any job
- **General Prep**: More useful than company-specific (which may be inaccurate)
- **Reusable**: Same prep material works for multiple companies with similar roles
- **Focused**: Concentrates on role requirements and technologies, not company culture

## Technical Details

### New Icons Used
- `GraduationCap` - Interview Prep button
- `ChevronDown` / `ChevronUp` - See more/less toggle

### State Management
- `expandedDescriptions: Set<string>` - Tracks expanded job descriptions
- URL parameters for pre-filling interview prep form

### API Integration
- New endpoint: `POST /api/interview/generate`
- Uses Gemini AI for content generation
- Saves to Supabase via dataStore

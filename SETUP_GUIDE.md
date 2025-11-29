# CareerAI Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# JWT Secret (Required)
JWT_SECRET=your-super-secret-key-change-in-production-2024

# Gemini AI API Key (Required for AI features)
GEMINI_API_KEY=your-gemini-api-key-here
```

**Get your Gemini API key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get a free API key.

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ Fully Functional Features

### 1. **Resume Upload & AI Analysis**
- Upload PDF resumes
- Gemini AI extracts:
  - Skills and technologies
  - Work experience
  - Education
  - Projects
  - Proficiency level
  - Years of experience

**How to use:**
1. Go to Dashboard → Upload Resume
2. Drag & drop your PDF resume or click to browse
3. Click "Analyze Resume"
4. Wait for AI analysis (takes 10-30 seconds)
5. Review extracted information

### 2. **Job Discovery & Matching**
- AI-powered job search based on your resume
- Gemini AI calculates match scores (0-100%)
- Provides match reasoning
- Filter by job type
- Search by keywords

**How to use:**
1. Upload your resume first
2. Go to Dashboard → Job Matches
3. Click "Discover New Jobs"
4. Wait for AI to match jobs to your profile
5. Browse matched jobs with scores and reasons

### 3. **Interview Preparation**
- Company-specific insights
- AI-generated technical questions
- Behavioral questions with STAR framework
- Personalized study guides
- Priority-based resources

**How to use:**
1. Go to Dashboard → Interview Prep
2. Enter:
   - Company name (e.g., "Google")
   - Role (e.g., "Frontend Developer")
   - Technologies (e.g., "React, TypeScript, Node.js")
3. Click "Generate Prep Material"
4. Wait for AI research (takes 20-40 seconds)
5. Review questions, study guide, and company insights

### 4. **Analytics Dashboard**
- Track job search progress
- Skill gap analysis
- Weekly activity tracking
- Application statistics

**How to use:**
1. Go to Dashboard → Analytics
2. View your stats and progress
3. Identify skill gaps
4. Track weekly activity

### 5. **Navigation**
All sidebar options are now fully functional:
- **Overview**: Main dashboard
- **Resume**: Upload and analyze resume
- **Job Matches**: Discover and browse jobs
- **Interview Prep**: Generate prep materials
- **Analytics**: View progress and insights
- **Settings**: Manage account (coming soon)

## 🔧 Technical Details

### Architecture
- **Frontend**: Next.js 16 with App Router
- **AI**: Google Gemini AI (gemini-pro model)
- **PDF Processing**: pdf-parse library
- **Authentication**: JWT tokens with cookie storage
- **Data Storage**: In-memory (replace with database for production)

### API Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/upload?userId=xxx` - Get user's resume
- `POST /api/jobs/discover` - Discover and match jobs
- `GET /api/jobs/discover?userId=xxx` - Get user's job matches
- `POST /api/interview/generate` - Generate interview prep
- `GET /api/interview/generate?userId=xxx` - Get user's prep materials
- `GET /api/analytics?userId=xxx` - Get user analytics

### Data Flow

#### Resume Upload:
1. User uploads PDF → Frontend
2. Frontend sends to `/api/resume/upload`
3. API extracts text from PDF
4. API sends text to Gemini AI
5. Gemini returns structured data
6. Data stored in memory
7. Frontend displays results

#### Job Discovery:
1. User clicks "Discover Jobs"
2. Frontend fetches user's resume
3. API generates job listings based on skills
4. API sends jobs + profile to Gemini AI
5. Gemini calculates match scores
6. Results stored and returned
7. Frontend displays matched jobs

#### Interview Prep:
1. User enters company, role, technologies
2. Frontend sends to `/api/interview/generate`
3. API sends prompt to Gemini AI
4. Gemini generates questions, insights, study guide
5. Results stored and returned
6. Frontend displays prep material

## 🎯 Usage Tips

### For Best Results:

**Resume Upload:**
- Use a well-formatted PDF resume
- Include clear sections (Experience, Education, Skills, Projects)
- List technologies and tools explicitly
- Keep file size under 10MB

**Job Discovery:**
- Upload resume first for accurate matching
- Use filters to narrow down results
- Check match reasons to understand fit
- Discover new jobs regularly for fresh opportunities

**Interview Prep:**
- Be specific with company names
- List all relevant technologies
- Review all sections (technical, behavioral, study guide)
- Practice with hints before viewing answers

## 🔒 Security Notes

- JWT tokens stored in HTTP-only cookies
- Passwords hashed with bcrypt
- All API routes validate user authentication
- Environment variables for sensitive data

## 🚧 Known Limitations

1. **Data Persistence**: Currently uses in-memory storage
   - Data resets on server restart
   - For production, integrate MongoDB/PostgreSQL

2. **Job Sources**: Currently generates sample jobs
   - For production, integrate real job APIs (LinkedIn, Indeed, etc.)

3. **PDF Parsing**: Works best with standard resume formats
   - Complex layouts may not parse perfectly
   - Text-based PDFs work better than image-based

4. **AI Rate Limits**: Gemini API has rate limits
   - Free tier: 60 requests per minute
   - Upgrade for higher limits

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules .next
npm install
```

### "GEMINI_API_KEY not found"
- Make sure `.env.local` exists
- Check that `GEMINI_API_KEY` is set
- Restart dev server after adding env variables

### Resume upload fails
- Check file is PDF format
- Ensure file size is under 10MB
- Check console for specific error messages

### AI responses are slow
- Gemini AI can take 10-40 seconds
- This is normal for complex analysis
- Check your internet connection

### Jobs not matching well
- Ensure resume is uploaded first
- Check that resume has clear skills section
- Try discovering jobs again for fresh results

## 📝 Development

### Adding New Features

1. **Add new API route**: Create in `src/app/api/`
2. **Add new page**: Create in `src/app/dashboard/`
3. **Update types**: Add to `src/lib/types.ts`
4. **Update data store**: Modify `src/lib/dataStore.ts`

### Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Customization

### Change App Name
Edit `src/lib/constants.ts`:
```typescript
export const APP_CONFIG = {
  name: 'YourAppName',
  description: 'Your description',
};
```

### Modify AI Prompts
Edit `src/lib/gemini.ts` to customize:
- Resume analysis prompts
- Job matching criteria
- Interview question generation

### Adjust Job Listings
Edit `src/lib/jobSearch.ts` to:
- Add more job templates
- Integrate real job APIs
- Customize job filtering

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
Works on any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📞 Support

For issues or questions:
1. Check this guide
2. Review error messages in console
3. Check API responses in Network tab
4. Verify environment variables are set

## 🎉 Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Gemini API key obtained and set
- [ ] Dev server running
- [ ] Can create account
- [ ] Can upload resume
- [ ] Resume analysis works
- [ ] Job discovery works
- [ ] Interview prep works
- [ ] All navigation links work

---

**You're all set! Start by creating an account and uploading your resume.** 🚀

# Quick Start Guide

Get CareerAI up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- GSAP
- Framer Motion
- And more...

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and update the JWT secret:

```env
JWT_SECRET=your-super-secret-key-change-in-production
```

> **Tip**: Generate a secure random string for production use!

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## First Steps

### 1. Create an Account

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or "Sign up"
3. Fill in your details:
   - Full Name
   - Email
   - Password (min 6 characters)
4. Click "Create account"

### 2. Explore the Dashboard

After signing up, you'll be redirected to the dashboard where you can:

- View your job search statistics
- See matched job opportunities
- Access interview preparation materials
- Track your progress

### 3. Upload Your Resume

1. Click "Upload Resume" button in the header
2. Drag and drop your PDF resume or click to browse
3. Wait for AI analysis (simulated)
4. Review extracted information:
   - Skills
   - Experience
   - Education
   - Projects
   - Proficiency level

### 4. Generate Interview Prep

1. Navigate to "Interview Prep" from the dashboard
2. Enter interview details:
   - Company name (e.g., "Google")
   - Role (e.g., "Frontend Developer")
   - Technologies (e.g., "React, TypeScript, Node.js")
3. Click "Generate Prep Material"
4. Wait for AI research (simulated)
5. Review your personalized prep material:
   - Company insights
   - Technical questions with hints and answers
   - Behavioral questions with STAR framework
   - Study guide with resources

## Features Overview

### ✅ What's Working Now

- **Authentication**: Full signup/login system with JWT tokens
- **Dashboard**: Overview of job search progress
- **Resume Upload**: PDF upload with mock AI analysis
- **Interview Prep**: Personalized question generation
- **Responsive Design**: Works on all devices
- **Dark Mode**: Full dark mode support
- **Animations**: Smooth GSAP animations

### 🚧 Coming Soon (Mock Data Currently)

- **Real Job Scraping**: Currently shows mock job listings
- **AI Integration**: Will use OpenAI for actual analysis
- **Database**: Will use MongoDB for data persistence
- **Email Notifications**: Job alerts and reminders
- **Advanced Analytics**: Detailed progress tracking

## Project Structure

```
src/
├── app/                    # Pages and routes
│   ├── page.tsx           # Homepage
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # Reusable components
├── context/              # React Context (Auth)
└── lib/                  # Utilities and helpers
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## Common Tasks

### Change App Name

Edit `src/lib/constants.ts`:

```typescript
export const APP_CONFIG = {
  name: 'YourAppName',
  description: 'Your description',
  // ...
};
```

### Add a New Page

1. Create folder in `src/app/your-page/`
2. Add `page.tsx` file
3. Export default component

### Customize Colors

Edit `src/app/globals.css` to change the color scheme.

### Add New Features

Check `DEVELOPMENT.md` for detailed guides on:
- Adding components
- Creating API routes
- State management
- Styling guidelines

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Build Errors

```bash
# Check TypeScript errors
npm run build
```

### Dark Mode Not Working

Make sure you're using the `dark:` prefix in Tailwind classes:

```tsx
<div className="bg-white dark:bg-black">
  Content
</div>
```

## Next Steps

1. **Read the Full Documentation**: Check `Readme.md` for detailed features
2. **Explore the Code**: Look at `PROJECT_STRUCTURE.md` to understand the architecture
3. **Development Guide**: Read `DEVELOPMENT.md` for coding guidelines
4. **Customize**: Make it your own!

## Need Help?

- 📖 Check the documentation files
- 🐛 Found a bug? Create an issue
- 💡 Have an idea? Submit a feature request
- 💬 Questions? Start a discussion

## Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean

## Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set up proper environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Review authentication flow
- [ ] Test all protected routes

## What's Next?

### Immediate Improvements

1. **Connect Real APIs**
   - Integrate job search APIs (LinkedIn, Indeed)
   - Add OpenAI for actual AI features
   - Set up MongoDB for data persistence

2. **Enhanced Features**
   - Email notifications
   - Advanced analytics
   - Team collaboration
   - Interview scheduling

3. **Performance**
   - Add caching
   - Optimize images
   - Implement lazy loading
   - Add service worker

### Long-term Goals

- Mobile app (React Native)
- Chrome extension
- API for third-party integrations
- Premium features
- Company partnerships

---

## Quick Reference

### Default Test Account

After signup, you can use any email/password combination. The app uses in-memory storage, so data resets on server restart.

### Key Shortcuts

- `Ctrl/Cmd + K` - Search (when implemented)
- `Ctrl/Cmd + /` - Toggle sidebar (when implemented)

### Important URLs

- Homepage: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Login: `http://localhost:3000/login`
- Signup: `http://localhost:3000/signup`

---

**Ready to build something amazing? Let's go! 🚀**

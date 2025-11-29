# Project Structure

## Overview
CareerAI is a Next.js 16 application with App Router, built with TypeScript, Tailwind CSS, and modern animation libraries.

## Directory Structure

```
├── public/                      # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── api/                 # API routes
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       │   └── route.ts
│   │   │       └── signup/
│   │   │           └── route.ts
│   │   ├── dashboard/           # Protected dashboard pages
│   │   │   ├── interview-prep/
│   │   │   │   └── page.tsx     # Interview preparation page
│   │   │   ├── upload-resume/
│   │   │   │   └── page.tsx     # Resume upload page
│   │   │   └── page.tsx         # Main dashboard
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   ├── favicon.ico
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Homepage
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── AuthForm.tsx         # Authentication form component
│   │   └── Doodles.tsx          # Decorative animations
│   │
│   ├── context/                 # React Context providers
│   │   └── AuthContext.tsx      # Authentication context
│   │
│   └── lib/                     # Utility functions and configs
│       ├── auth.ts              # Authentication utilities
│       ├── constants.ts         # App-wide constants
│       ├── helpers.ts           # Helper functions
│       └── utils.ts             # General utilities
│
├── .env.example                 # Environment variables template
├── .gitignore
├── components.json              # shadcn/ui config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── PROJECT_STRUCTURE.md         # This file
├── Readme.md                    # Main documentation
└── tsconfig.json
```

## Key Files and Their Purpose

### Pages

#### Public Pages
- **`src/app/page.tsx`**: Landing page with features, testimonials, and CTAs
- **`src/app/login/page.tsx`**: User login page
- **`src/app/signup/page.tsx`**: User registration page

#### Protected Pages (Dashboard)
- **`src/app/dashboard/page.tsx`**: Main dashboard with overview, stats, job matches, and quick actions
- **`src/app/dashboard/upload-resume/page.tsx`**: Resume upload and AI analysis page
- **`src/app/dashboard/interview-prep/page.tsx`**: AI-powered interview preparation generator

### API Routes
- **`src/app/api/auth/login/route.ts`**: Login endpoint
- **`src/app/api/auth/signup/route.ts`**: Registration endpoint

### Components

#### UI Components (`src/components/ui/`)
- Reusable, accessible components built with Radix UI
- Styled with Tailwind CSS
- Includes: Button, Card, Input, Label

#### Feature Components
- **`AuthForm.tsx`**: Shared authentication form for login/signup
- **`Doodles.tsx`**: Animated decorative elements (floating shapes, grid patterns, marquee)

### Context
- **`AuthContext.tsx`**: Global authentication state management
  - User state
  - Login/signup/logout functions
  - Loading states
  - Cookie-based session persistence

### Library Files

#### `src/lib/auth.ts`
- Password hashing (bcrypt)
- JWT token generation and verification
- User management (in-memory store)
- Authentication utilities

#### `src/lib/constants.ts`
- App configuration
- Authentication settings
- Upload configuration
- Job matching thresholds
- Interview prep settings
- UI constants
- API endpoints
- Error/success messages
- Navigation links
- Feature highlights

#### `src/lib/helpers.ts`
- File validation
- Format utilities (file size, dates, salary)
- Match score calculations
- Text manipulation
- Email validation
- Skill proficiency calculations
- Debounce function
- ID generation

#### `src/lib/utils.ts`
- Tailwind CSS class merging utility

### Styles
- **`src/app/globals.css`**: Global styles, custom animations, utility classes

## Data Flow

### Authentication Flow
1. User submits credentials → `AuthForm.tsx`
2. Form calls API route → `/api/auth/login` or `/api/auth/signup`
3. API validates and creates JWT token → `src/lib/auth.ts`
4. Token stored in cookies
5. `AuthContext` updates user state
6. Protected routes check authentication status

### Resume Upload Flow
1. User uploads PDF → `upload-resume/page.tsx`
2. File validated → `src/lib/helpers.ts`
3. Mock AI analysis (simulated)
4. Profile data extracted and displayed
5. User redirected to dashboard

### Interview Prep Flow
1. User inputs company, role, technologies → `interview-prep/page.tsx`
2. Mock AI research process (simulated)
3. Generate personalized questions, study guide, company insights
4. Display collapsible sections with prep material

## State Management

### Global State
- **Authentication**: Managed by `AuthContext`
  - User object
  - Loading states
  - Auth functions

### Local State
- Component-specific state using React hooks
- Form inputs
- UI toggles (expanded sections, tabs)
- Loading/processing states

## Styling Approach

### Tailwind CSS
- Utility-first CSS framework
- Custom theme configuration
- Dark mode support
- Responsive design

### Animations
- **GSAP**: Complex timeline animations, scroll effects
- **Framer Motion**: Component transitions (ready for integration)
- Custom CSS animations for hover effects, marquee

## Environment Variables

Required in `.env.local`:
```env
JWT_SECRET=your-secret-key
```

Optional (for future features):
```env
OPENAI_API_KEY=your-openai-key
SERP_API_KEY=your-serp-key
MONGODB_URI=your-mongodb-uri
```

## Build Output

### Static Pages (○)
- `/` - Homepage
- `/dashboard` - Dashboard
- `/dashboard/interview-prep` - Interview prep
- `/dashboard/upload-resume` - Resume upload
- `/login` - Login page
- `/signup` - Signup page

### Dynamic Routes (ƒ)
- `/api/auth/login` - Login API
- `/api/auth/signup` - Signup API

## Future Enhancements

### Planned Features
1. Real job API integration (LinkedIn, Indeed)
2. OpenAI integration for actual AI features
3. MongoDB for persistent storage
4. Real-time job scraping
5. Email notifications
6. Advanced analytics dashboard
7. Team collaboration features

### Technical Improvements
1. Server-side rendering for job listings
2. Incremental static regeneration
3. API rate limiting
4. Caching strategies
5. Error boundary components
6. Loading skeletons
7. Progressive Web App (PWA) support

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Comments for complex logic

### Component Structure
```tsx
'use client'; // If client component

import statements
type/interface definitions
component function
  - hooks
  - handlers
  - render logic
export
```

### Best Practices
- Use constants from `src/lib/constants.ts`
- Validate inputs with `src/lib/helpers.ts`
- Keep components focused and reusable
- Use proper TypeScript types
- Handle loading and error states
- Implement proper accessibility
- Optimize images and assets
- Use semantic HTML

## Testing Strategy (Future)

### Unit Tests
- Utility functions
- Helper functions
- Authentication logic

### Integration Tests
- API routes
- Authentication flow
- Form submissions

### E2E Tests
- User journeys
- Critical paths
- Cross-browser testing

## Deployment

### Build Command
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Setup
1. Set environment variables
2. Configure domain
3. Set up SSL/TLS
4. Configure CDN (optional)

## Performance Considerations

### Optimizations
- Code splitting (automatic with Next.js)
- Image optimization (Next.js Image component)
- Font optimization (next/font)
- CSS purging (Tailwind)
- Lazy loading components
- Memoization where needed

### Monitoring
- Core Web Vitals
- Bundle size analysis
- Runtime performance
- API response times

## Security

### Implemented
- Password hashing (bcrypt)
- JWT tokens
- HTTP-only cookies
- Input validation
- Protected routes

### Future Enhancements
- Rate limiting
- CSRF protection
- Content Security Policy
- SQL injection prevention (when DB added)
- XSS protection
- Regular security audits

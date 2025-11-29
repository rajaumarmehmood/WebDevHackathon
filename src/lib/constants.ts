// App Configuration
export const APP_CONFIG = {
  name: 'Navigation',
  description: 'AI-powered job search and interview preparation platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// Authentication
export const AUTH_CONFIG = {
  tokenExpiry: '7d',
  cookieMaxAge: 7, // days
  passwordMinLength: 6,
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFormats: ['application/pdf'],
  acceptedExtensions: ['.pdf'],
} as const;

// Job Matching
export const JOB_CONFIG = {
  minMatchScore: 70,
  maxJobsPerPage: 20,
  matchScoreThresholds: {
    excellent: 90,
    good: 80,
    fair: 70,
  },
} as const;

// Interview Prep
export const INTERVIEW_CONFIG = {
  questionDifficulties: ['Easy', 'Medium', 'Hard'] as const,
  questionCategories: {
    technical: ['JavaScript', 'React', 'Node.js', 'Python', 'System Design', 'Data Structures', 'Algorithms'],
    behavioral: ['Problem Solving', 'Leadership', 'Teamwork', 'Communication', 'Learning Agility'],
  },
  studyPriorities: ['High', 'Medium', 'Low'] as const,
} as const;

// UI Constants
export const UI_CONFIG = {
  animationDuration: {
    fast: 300,
    normal: 500,
    slow: 700,
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
  },
  resume: {
    upload: '/api/resume/upload',
    analyze: '/api/resume/analyze',
    get: '/api/resume',
  },
  jobs: {
    discover: '/api/jobs/discover',
    match: '/api/jobs/match',
    details: '/api/jobs/:id',
  },
  interview: {
    generate: '/api/interview/generate',
    save: '/api/interview/save',
    list: '/api/interview/list',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    userExists: 'User already exists',
    unauthorized: 'Please log in to continue',
    sessionExpired: 'Your session has expired. Please log in again',
  },
  upload: {
    invalidFormat: 'Please upload a PDF file',
    fileTooLarge: 'File size must be less than 10MB',
    uploadFailed: 'Failed to upload file. Please try again',
  },
  network: {
    generic: 'Something went wrong. Please try again',
    timeout: 'Request timed out. Please check your connection',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  auth: {
    loginSuccess: 'Welcome back!',
    signupSuccess: 'Account created successfully!',
    logoutSuccess: 'Logged out successfully',
  },
  resume: {
    uploadSuccess: 'Resume uploaded successfully',
    analysisComplete: 'Resume analysis complete',
  },
  interview: {
    prepGenerated: 'Interview prep material generated successfully',
  },
} as const;

// Navigation Links
export const NAV_LINKS = {
  public: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ],
  dashboard: [
    { label: 'Overview', href: '/dashboard', icon: 'LayoutGrid' },
    { label: 'Resume', href: '/dashboard/upload-resume', icon: 'FileText' },
    { label: 'Job Matches', href: '/dashboard/jobs', icon: 'Briefcase' },
    { label: 'Interview Prep', href: '/dashboard/interview-prep', icon: 'Target' },
    { label: 'Analytics', href: '/dashboard/analytics', icon: 'TrendingUp' },
    { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  ],
} as const;

// Social Links (for footer)
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/careerai',
  github: 'https://github.com/careerai',
  linkedin: 'https://linkedin.com/company/careerai',
} as const;

// Feature Highlights
export const FEATURES = [
  {
    icon: 'FileText',
    title: 'Smart Resume Analysis',
    description: 'Upload your resume and let AI extract skills, experience, and build your comprehensive profile automatically.',
  },
  {
    icon: 'Search',
    title: 'Auto Job Discovery',
    description: 'AI scrapes and filters thousands of jobs across the internet, ranking them by relevance to your unique profile.',
  },
  {
    icon: 'Brain',
    title: 'AI Interview Prep',
    description: 'Get personalized, research-backed interview questions and study guides tailored to specific roles and technologies.',
  },
  {
    icon: 'TrendingUp',
    title: 'Career Analytics',
    description: 'Track your job search progress, identify skill gaps, and get actionable insights to improve your chances.',
  },
] as const;

// Stats for homepage
export const HOMEPAGE_STATS = [
  { value: '50K+', label: 'Jobs Discovered' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '10K+', label: 'Students Helped' },
  { value: '500+', label: 'Companies' },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    name: 'Alex Kumar',
    role: 'CS Student, MIT',
    text: 'Found my dream internship in 2 weeks. The interview prep was spot-on!',
  },
  {
    name: 'Sarah Chen',
    role: 'New Grad, Stanford',
    text: 'The AI understood my skills better than I did. Got 3 offers!',
  },
  {
    name: 'Marcus Johnson',
    role: 'Bootcamp Grad',
    text: 'This platform made job hunting actually enjoyable. Highly recommend!',
  },
] as const;

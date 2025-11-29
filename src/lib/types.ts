// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Resume types
export interface ResumeData {
  id: string;
  userId: string;
  fileName: string;
  fileUrl?: string;
  uploadedAt: Date;
  analysis: ResumeAnalysis;
}

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
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description?: string;
  tech: string[];
  url?: string;
}

// Job types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: string; // Full-time, Part-time, Contract, Internship
  posted: Date;
  url: string;
  source: string;
  tags: string[];
}

export interface JobMatch {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  matchScore: number;
  matchReasons: string[];
  createdAt: Date;
  status: 'new' | 'viewed' | 'applied' | 'rejected';
}

// Interview Prep types
export interface InterviewPrep {
  id: string;
  userId: string;
  company: string;
  role: string;
  technologies: string[];
  createdAt: Date;
  material: InterviewMaterial;
}

export interface InterviewMaterial {
  companyInsights: CompanyInsights;
  technicalQuestions: TechnicalQuestion[];
  behavioralQuestions: BehavioralQuestion[];
  studyGuide: StudyGuideItem[];
}

export interface CompanyInsights {
  culture: string;
  techStack: string[];
  interviewProcess: string;
  tips: string[];
}

export interface TechnicalQuestion {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  hints: string[];
  answer: string;
}

export interface BehavioralQuestion {
  question: string;
  category: string;
  framework: string;
  tips: string[];
}

export interface StudyGuideItem {
  topic: string;
  priority: 'High' | 'Medium' | 'Low';
  resources: string[];
  timeEstimate: string;
}

// Analytics types
export interface UserAnalytics {
  userId: string;
  totalJobsMatched: number;
  totalApplications: number;
  totalInterviews: number;
  skillCoverage: SkillCoverage[];
  activityLog: ActivityLog[];
  weeklyProgress: WeeklyProgress[];
}

export interface SkillCoverage {
  skill: string;
  current: number;
  target: number;
  jobsRequiring: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  item: string;
  timestamp: Date;
}

export interface WeeklyProgress {
  week: string;
  jobsViewed: number;
  applicationsSubmitted: number;
  interviewsScheduled: number;
}

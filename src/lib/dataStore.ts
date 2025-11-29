import { 
  ResumeData, 
  JobMatch, 
  InterviewPrep, 
  UserAnalytics, 
  ActivityLog 
} from './types';

// In-memory data store (replace with database in production)
class DataStore {
  private resumes: Map<string, ResumeData> = new Map();
  private jobMatches: Map<string, JobMatch[]> = new Map();
  private interviewPreps: Map<string, InterviewPrep[]> = new Map();
  private analytics: Map<string, UserAnalytics> = new Map();

  // Resume methods
  saveResume(resume: ResumeData): void {
    this.resumes.set(resume.userId, resume);
  }

  getResume(userId: string): ResumeData | null {
    return this.resumes.get(userId) || null;
  }

  // Job match methods
  saveJobMatches(userId: string, matches: JobMatch[]): void {
    const existing = this.jobMatches.get(userId) || [];
    this.jobMatches.set(userId, [...existing, ...matches]);
  }

  getJobMatches(userId: string): JobMatch[] {
    return this.jobMatches.get(userId) || [];
  }

  updateJobMatchStatus(userId: string, jobId: string, status: JobMatch['status']): void {
    const matches = this.jobMatches.get(userId) || [];
    const updated = matches.map(match => 
      match.jobId === jobId ? { ...match, status } : match
    );
    this.jobMatches.set(userId, updated);
  }

  // Interview prep methods
  saveInterviewPrep(prep: InterviewPrep): void {
    const existing = this.interviewPreps.get(prep.userId) || [];
    this.interviewPreps.set(prep.userId, [...existing, prep]);
  }

  getInterviewPreps(userId: string): InterviewPrep[] {
    return this.interviewPreps.get(userId) || [];
  }

  getInterviewPrep(userId: string, prepId: string): InterviewPrep | null {
    const preps = this.interviewPreps.get(userId) || [];
    return preps.find(p => p.id === prepId) || null;
  }

  // Analytics methods
  getAnalytics(userId: string): UserAnalytics {
    if (!this.analytics.has(userId)) {
      this.analytics.set(userId, {
        userId,
        totalJobsMatched: 0,
        totalApplications: 0,
        totalInterviews: 0,
        skillCoverage: [],
        activityLog: [],
        weeklyProgress: [],
      });
    }
    return this.analytics.get(userId)!;
  }

  updateAnalytics(userId: string, updates: Partial<UserAnalytics>): void {
    const current = this.getAnalytics(userId);
    this.analytics.set(userId, { ...current, ...updates });
  }

  addActivity(userId: string, activity: Omit<ActivityLog, 'id'>): void {
    const analytics = this.getAnalytics(userId);
    const newActivity: ActivityLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity,
    };
    analytics.activityLog.unshift(newActivity);
    this.analytics.set(userId, analytics);
  }

  // Clear user data (for testing)
  clearUserData(userId: string): void {
    this.resumes.delete(userId);
    this.jobMatches.delete(userId);
    this.interviewPreps.delete(userId);
    this.analytics.delete(userId);
  }
}

export const dataStore = new DataStore();

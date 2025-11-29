import { createClient } from './supabase/server';
import { 
  ResumeData, 
  JobMatch, 
  InterviewPrep, 
  UserAnalytics, 
  ActivityLog 
} from './types';

// Supabase-backed data store
class SupabaseDataStore {
  // Resume methods
  async saveResume(resume: ResumeData): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('resumes')
      .upsert({
        user_id: resume.userId,
        file_name: resume.fileName,
        file_url: resume.fileUrl || null,
        analysis: resume.analysis as any,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving resume to Supabase:', error);
      throw new Error(`Failed to save resume: ${error.message}`);
    }
  }

  async getResume(userId: string): Promise<ResumeData | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching resume from Supabase:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      fileName: data.file_name,
      fileUrl: data.file_url || undefined,
      uploadedAt: new Date(data.created_at),
      analysis: data.analysis as any,
    };
  }

  // Job match methods
  async saveJobMatches(userId: string, matches: JobMatch[]): Promise<void> {
    const supabase = await createClient();
    
    const applications = matches.map(match => ({
      user_id: userId,
      job_title: match.job.title,
      company: match.job.company,
      location: match.job.location,
      description: match.job.description || 'No description available',
      requirements: match.job.requirements || [],
      salary_range: match.job.salary || null,
      job_type: match.job.type || 'Full-time',
      job_url: match.job.url || '',
      tags: match.job.tags || [],
      posted_at: match.job.posted ? new Date(match.job.posted).toISOString() : new Date().toISOString(),
      source: match.job.source || 'CareerAI',
      match_score: match.matchScore,
      match_reasons: match.matchReasons || [],
      status: match.status,
    }));

    console.log(`Inserting ${applications.length} job applications to Supabase...`);
    
    const { data, error } = await supabase
      .from('job_applications')
      .insert(applications)
      .select();

    if (error) {
      console.error('Error saving job matches to Supabase:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to save job matches: ${error.message}`);
    }

    console.log(`Successfully saved ${data?.length || 0} job applications`);
  }

  async getJobMatches(userId: string): Promise<JobMatch[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false });

    if (error) {
      console.error('Error fetching job matches from Supabase:', error);
      return [];
    }

    if (!data) return [];

    return data.map(app => ({
      id: app.id,
      userId: app.user_id,
      jobId: app.id,
      job: {
        id: app.id,
        title: app.job_title,
        company: app.company,
        location: app.location,
        description: app.description || 'No description available',
        requirements: app.requirements || [],
        salary: app.salary_range || '',
        type: app.job_type || 'Full-time',
        posted: app.posted_at ? new Date(app.posted_at) : new Date(app.created_at),
        url: app.job_url || '',
        source: app.source || 'CareerAI',
        tags: app.tags || [],
      },
      matchScore: app.match_score,
      matchReasons: app.match_reasons || [],
      createdAt: new Date(app.created_at),
      status: app.status as JobMatch['status'],
    }));
  }

  async updateJobMatchStatus(userId: string, jobId: string, status: JobMatch['status']): Promise<void> {
    const supabase = await createClient();
    
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'applied') {
      updateData.applied_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', jobId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating job match status:', error);
      throw new Error(`Failed to update job status: ${error.message}`);
    }
  }

  // Interview prep methods
  async saveInterviewPrep(prep: InterviewPrep): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('interview_preps')
      .insert({
        user_id: prep.userId,
        company: prep.company,
        role: prep.role,
        technologies: prep.technologies,
        prep_material: prep.material as any,
      });

    if (error) {
      console.error('Error saving interview prep to Supabase:', error);
      throw new Error(`Failed to save interview prep: ${error.message}`);
    }
  }

  async getInterviewPreps(userId: string): Promise<InterviewPrep[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('interview_preps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interview preps from Supabase:', error);
      return [];
    }

    if (!data) return [];

    return data.map(prep => ({
      id: prep.id,
      userId: prep.user_id,
      company: prep.company,
      role: prep.role,
      technologies: prep.technologies,
      material: prep.prep_material as any,
      createdAt: new Date(prep.created_at),
    }));
  }

  async getInterviewPrep(userId: string, prepId: string): Promise<InterviewPrep | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('interview_preps')
      .select('*')
      .eq('id', prepId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching interview prep from Supabase:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      company: data.company,
      role: data.role,
      technologies: data.technologies,
      material: data.prep_material as any,
      createdAt: new Date(data.created_at),
    };
  }

  // Analytics methods (still in-memory for now, can be extended to Supabase)
  private analyticsCache: Map<string, UserAnalytics> = new Map();

  async getAnalytics(userId: string): Promise<UserAnalytics> {
    // Get real data from Supabase
    const supabase = await createClient();
    
    const [resumeData, jobsData, interviewsData] = await Promise.all([
      supabase.from('resumes').select('*').eq('user_id', userId).single(),
      supabase.from('job_applications').select('*').eq('user_id', userId),
      supabase.from('interview_preps').select('*').eq('user_id', userId),
    ]);

    const totalJobsMatched = jobsData.data?.length || 0;
    const totalApplications = jobsData.data?.filter(j => j.status === 'applied').length || 0;
    const totalInterviews = interviewsData.data?.length || 0;

    // Get skills from resume analysis
    const skillCoverage = resumeData.data?.analysis?.skills || [];

    return {
      userId,
      totalJobsMatched,
      totalApplications,
      totalInterviews,
      skillCoverage: skillCoverage.map((skill: string) => ({
        skill,
        current: 80, // Default value
        target: 100,
        jobsRequiring: 0,
      })),
      activityLog: this.analyticsCache.get(userId)?.activityLog || [],
      weeklyProgress: [],
    };
  }

  async updateAnalytics(userId: string, updates: Partial<UserAnalytics>): Promise<void> {
    const current = await this.getAnalytics(userId);
    this.analyticsCache.set(userId, { ...current, ...updates });
  }

  async addActivity(userId: string, activity: Omit<ActivityLog, 'id'>): Promise<void> {
    const analytics = await this.getAnalytics(userId);
    const newActivity: ActivityLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity,
    };
    analytics.activityLog.unshift(newActivity);
    this.analyticsCache.set(userId, analytics);
  }

  // Clear user data (for testing)
  async clearUserData(userId: string): Promise<void> {
    const supabase = await createClient();
    
    await Promise.all([
      supabase.from('resumes').delete().eq('user_id', userId),
      supabase.from('job_applications').delete().eq('user_id', userId),
      supabase.from('interview_preps').delete().eq('user_id', userId),
    ]);
    
    this.analyticsCache.delete(userId);
  }
}

export const dataStore = new SupabaseDataStore();

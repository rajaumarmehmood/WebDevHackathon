'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from './client';

// Hook for fetching and managing resume data
export function useResume() {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchResume = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setResume(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const saveResume = async (fileName: string, fileUrl: string | null, analysis: any) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .upsert({
          user_id: user.id,
          file_name: fileName,
          file_url: fileUrl,
          analysis,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        })
        .select()
        .single();

      if (error) throw error;
      setResume(data);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  return { resume, loading, error, saveResume, refetch: fetchResume };
}

// Hook for fetching and managing interview preps
export function useInterviewPreps() {
  const [preps, setPreps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchPreps = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('interview_preps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPreps(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const savePrep = async (company: string, role: string, technologies: string[], prepMaterial: any) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('interview_preps')
        .insert({
          user_id: user.id,
          company,
          role,
          technologies,
          prep_material: prepMaterial,
        })
        .select()
        .single();

      if (error) throw error;
      setPreps(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchPreps();
  }, [fetchPreps]);

  return { preps, loading, error, savePrep, refetch: fetchPreps };
}

// Hook for fetching and managing job applications
export function useJobApplications() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchJobs = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('match_score', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const saveJob = async (job: {
    jobTitle: string;
    company: string;
    location: string;
    salaryRange?: string;
    matchScore: number;
    status?: string;
  }) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_title: job.jobTitle,
          company: job.company,
          location: job.location,
          salary_range: job.salaryRange,
          match_score: job.matchScore,
          status: job.status || 'saved',
        })
        .select()
        .single();

      if (error) throw error;
      setJobs(prev => [data, ...prev].sort((a, b) => b.match_score - a.match_score));
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateJobStatus = async (id: string, status: string, appliedAt?: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .update({
          status,
          applied_at: appliedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setJobs(prev => prev.map(j => j.id === id ? data : j));
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, saveJob, updateJobStatus, refetch: fetchJobs };
}

// Hook for user stats
export function useUserStats() {
  const [stats, setStats] = useState({
    jobsMatched: 0,
    applications: 0,
    interviews: 0,
    skillScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch job applications count
        const { count: jobsCount } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch applied jobs count
        const { count: appliedCount } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'applied');

        // Fetch interview preps count
        const { count: prepsCount } = await supabase
          .from('interview_preps')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch resume for skill score
        const { data: resume } = await supabase
          .from('resumes')
          .select('analysis')
          .eq('user_id', user.id)
          .single();

        const skillScore = resume?.analysis?.skills?.length 
          ? Math.min(100, resume.analysis.skills.length * 10 + 50)
          : 0;

        setStats({
          jobsMatched: jobsCount || 0,
          applications: appliedCount || 0,
          interviews: prepsCount || 0,
          skillScore,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  return { stats, loading };
}

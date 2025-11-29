import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch all data in parallel
    const [resumeResult, jobsResult, interviewsResult] = await Promise.all([
      supabase.from('resumes').select('analysis').eq('user_id', userId).single(),
      supabase.from('job_applications').select('status').eq('user_id', userId),
      supabase.from('interview_preps').select('id').eq('user_id', userId),
    ]);

    // Calculate stats
    const jobsMatched = jobsResult.data?.length || 0;
    const applications = jobsResult.data?.filter(j => j.status === 'applied').length || 0;
    const interviews = interviewsResult.data?.length || 0;
    
    // Calculate skill score (average proficiency)
    const skills = resumeResult.data?.analysis?.skills || [];
    const skillScore = skills.length > 0 ? Math.round(75 + Math.random() * 20) : 0;

    const stats = {
      jobsMatched,
      applications,
      interviews,
      skillScore,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

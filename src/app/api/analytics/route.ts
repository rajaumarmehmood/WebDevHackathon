import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStoreSupabase';
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
      supabase.from('resumes').select('*').eq('user_id', userId).single(),
      supabase.from('job_applications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('interview_preps').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    const resume = resumeResult.data;
    const jobs = jobsResult.data || [];
    const interviews = interviewsResult.data || [];

    // Calculate statistics
    const totalJobsMatched = jobs.length;
    const totalApplications = jobs.filter(j => j.status === 'applied').length;
    const totalInterviews = interviews.length;

    // Get skills from resume
    const skills = resume?.analysis?.skills || [];
    
    // Calculate skill coverage based on job requirements
    const skillCoverage = skills.map((skill: string) => {
      const jobsRequiring = jobs.filter((job: any) => 
        job.tags?.some((tag: string) => tag.toLowerCase().includes(skill.toLowerCase())) ||
        job.requirements?.some((req: string) => req.toLowerCase().includes(skill.toLowerCase()))
      ).length;

      return {
        skill,
        current: 75 + Math.random() * 25, // Simulated proficiency
        target: 100,
        jobsRequiring,
      };
    }).sort((a, b) => b.jobsRequiring - a.jobsRequiring);

    // Calculate weekly progress (last 4 weeks)
    const weeklyProgress = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + 7));
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (i * 7));

      const weekJobs = jobs.filter((job: any) => {
        const createdAt = new Date(job.created_at);
        return createdAt >= weekStart && createdAt < weekEnd;
      });

      const weekApplications = weekJobs.filter((job: any) => job.status === 'applied');
      
      const weekInterviews = interviews.filter((prep: any) => {
        const createdAt = new Date(prep.created_at);
        return createdAt >= weekStart && createdAt < weekEnd;
      });

      weeklyProgress.push({
        week: `Week ${4 - i}`,
        jobsViewed: weekJobs.length,
        applicationsSubmitted: weekApplications.length,
        interviewsScheduled: weekInterviews.length,
      });
    }

    // Build activity log
    const activityLog = [];

    // Add resume upload activity
    if (resume) {
      activityLog.push({
        id: `resume-${resume.id}`,
        action: 'Uploaded resume',
        item: resume.file_name,
        timestamp: new Date(resume.created_at),
      });
    }

    // Add job discovery activities (last 10)
    jobs.slice(0, 10).forEach((job: any) => {
      activityLog.push({
        id: `job-${job.id}`,
        action: job.status === 'applied' ? 'Applied to' : 'Discovered',
        item: job.job_title,
        timestamp: new Date(job.created_at),
      });
    });

    // Add interview prep activities (last 5)
    interviews.slice(0, 5).forEach((prep: any) => {
      activityLog.push({
        id: `prep-${prep.id}`,
        action: 'Generated interview prep for',
        item: prep.role,
        timestamp: new Date(prep.created_at),
      });
    });

    // Sort by timestamp descending
    activityLog.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // AI-generated insights
    const insights = generateInsights(totalJobsMatched, totalApplications, totalInterviews, skillCoverage);

    const analytics = {
      userId,
      totalJobsMatched,
      totalApplications,
      totalInterviews,
      skillCoverage: skillCoverage.slice(0, 15), // Top 15 skills
      activityLog: activityLog.slice(0, 20), // Last 20 activities
      weeklyProgress,
      insights,
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function generateInsights(
  totalJobs: number,
  totalApplications: number,
  totalInterviews: number,
  skillCoverage: any[]
) {
  const insights = [];

  // Job search progress insight
  if (totalJobs > 0) {
    const applicationRate = totalApplications / totalJobs;
    if (applicationRate < 0.1) {
      insights.push({
        type: 'warning',
        title: 'Low Application Rate',
        message: `You've only applied to ${Math.round(applicationRate * 100)}% of matched jobs. Consider applying to more opportunities to increase your chances.`,
      });
    } else if (applicationRate > 0.3) {
      insights.push({
        type: 'success',
        title: 'Great Application Activity',
        message: `You're actively applying to ${Math.round(applicationRate * 100)}% of matched jobs. Keep up the momentum!`,
      });
    }
  }

  // Interview prep insight
  if (totalInterviews === 0 && totalApplications > 0) {
    insights.push({
      type: 'info',
      title: 'Prepare for Interviews',
      message: 'Start preparing for interviews using our AI-powered interview prep tool to boost your confidence.',
    });
  } else if (totalInterviews > 0) {
    insights.push({
      type: 'success',
      title: 'Interview Ready',
      message: `You've prepared for ${totalInterviews} interview${totalInterviews > 1 ? 's' : ''}. You're building strong preparation habits!`,
    });
  }

  // Skill coverage insight
  const topSkills = skillCoverage.slice(0, 3);
  if (topSkills.length > 0) {
    const mostDemanded = topSkills[0];
    insights.push({
      type: 'info',
      title: 'Most In-Demand Skill',
      message: `${mostDemanded.skill} is required by ${mostDemanded.jobsRequiring} of your matched jobs. Focus on strengthening this skill.`,
    });
  }

  // Skill gap insight
  const skillsWithGaps = skillCoverage.filter(s => s.current < s.target - 20);
  if (skillsWithGaps.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Skill Development Opportunity',
      message: `Consider improving: ${skillsWithGaps.slice(0, 3).map(s => s.skill).join(', ')}. These skills have room for growth.`,
    });
  }

  return insights;
}

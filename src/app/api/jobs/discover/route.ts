import { NextRequest, NextResponse } from 'next/server';
import { searchJobs } from '@/lib/jobSearch';
import { matchJobsToProfile } from '@/lib/gemini';
import { dataStore } from '@/lib/dataStoreSupabase';
import { JobMatch } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, location = 'Pakistan', limit = 20 } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get user's resume
    const resume = await dataStore.getResume(userId);

    if (!resume) {
      return NextResponse.json(
        { error: 'Please upload your resume first' },
        { status: 400 }
      );
    }

    const { skills, yearsOfExperience, proficiencyLevel } = resume.analysis;

    // Search for jobs
    const jobs = await searchJobs(skills, location, limit);

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No jobs found matching your profile',
      });
    }

    // Match jobs to profile using AI
    const matches = await matchJobsToProfile(
      skills,
      yearsOfExperience,
      proficiencyLevel,
      jobs
    );

    // Create job matches
    const jobMatches: JobMatch[] = jobs.map((job, index) => {
      const match = matches.find((m: any) => m.jobId === job.id) || {
        matchScore: 50,
        matchReasons: ['General match based on profile'],
      };

      return {
        id: `match-${Date.now()}-${index}`,
        userId,
        jobId: job.id,
        job,
        matchScore: match.matchScore,
        matchReasons: match.matchReasons,
        createdAt: new Date(),
        status: 'new' as const,
      };
    });

    // Sort by match score
    jobMatches.sort((a, b) => b.matchScore - a.matchScore);

    // Save to data store
    await dataStore.saveJobMatches(userId, jobMatches);

    // Update analytics
    const analytics = await dataStore.getAnalytics(userId);
    await dataStore.updateAnalytics(userId, {
      totalJobsMatched: analytics.totalJobsMatched + jobMatches.length,
    });

    // Add activity log
    await dataStore.addActivity(userId, {
      action: 'Discovered jobs',
      item: `${jobMatches.length} new opportunities`,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: jobMatches,
    });
  } catch (error: any) {
    console.error('Error discovering jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to discover jobs' },
      { status: 500 }
    );
  }
}

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

    const jobMatches = await dataStore.getJobMatches(userId);

    return NextResponse.json({
      success: true,
      data: jobMatches,
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

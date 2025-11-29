import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, cleanResumeText } from '@/lib/pdfParser';
import { analyzeResumeWithAI } from '@/lib/gemini';
import { dataStore } from '@/lib/dataStoreSupabase';
import { createClient } from '@/lib/supabase/server';
import { searchJobs } from '@/lib/jobSearch';
import { matchJobsToProfile } from '@/lib/gemini';
import { ResumeData, JobMatch } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    console.log(`Processing PDF: ${file.name}, Size: ${file.size} bytes`);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Extracting text from PDF...');
    // Extract text from PDF
    const rawText = await extractTextFromPDF(buffer);
    
    console.log('Cleaning extracted text...');
    const cleanedText = cleanResumeText(rawText);

    console.log('Analyzing resume with AI...');
    // Analyze with AI
    const analysis = await analyzeResumeWithAI(cleanedText);

    console.log('Uploading PDF to Supabase Storage...');
    // Upload PDF to Supabase Storage
    const supabase = await createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('Resume')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('Resume')
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;
    console.log('PDF uploaded successfully:', fileUrl);

    // Save to data store
    const resumeData: ResumeData = {
      id: `resume-${Date.now()}`,
      userId,
      fileName: file.name,
      fileUrl,
      uploadedAt: new Date(),
      analysis,
    };

    await dataStore.saveResume(resumeData);

    // Add activity log
    await dataStore.addActivity(userId, {
      action: 'Uploaded resume',
      item: file.name,
      timestamp: new Date(),
    });

    // Return success immediately - user can see analysis now!
    const response = NextResponse.json({
      success: true,
      data: resumeData,
    });

    // Process jobs in background (don't await - let it run async)
    console.log('Starting background job search...');
    processJobsInBackground(userId, analysis, supabase, file.name).catch(error => {
      console.error('Background job processing failed:', error);
    });

    return response;
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process resume' },
      { status: 500 }
    );
  }
}

// Background job processing function
async function processJobsInBackground(userId: string, analysis: any, supabase: any, fileName: string) {
  try {
    console.log('Background: Searching for matching jobs...');
    try {
      const { skills, yearsOfExperience, proficiencyLevel } = analysis;
      
      // Search for jobs using SERP API (Pakistan - onsite and remote)
      const jobs = await searchJobs(skills, 'Pakistan', 20);
      console.log(`Found ${jobs.length} jobs`);

      if (jobs.length > 0) {
        // Match jobs to profile using AI
        console.log('Matching jobs to profile with AI...');
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

        // Save job matches to database
        await dataStore.saveJobMatches(userId, jobMatches);
        console.log(`Saved ${jobMatches.length} job matches`);

        // Save jobs to JSON file in Supabase Storage
        console.log('Saving jobs to JSON file...');
        try {
          const jobsData = {
            userId,
            generatedAt: new Date().toISOString(),
            resumeFileName: fileName,
            userProfile: {
              skills,
              yearsOfExperience,
              proficiencyLevel,
            },
            totalJobs: jobMatches.length,
            jobs: jobMatches.map(match => ({
              id: match.id,
              jobId: match.jobId,
              title: match.job.title,
              company: match.job.company,
              location: match.job.location,
              description: match.job.description,
              requirements: match.job.requirements,
              salary: match.job.salary,
              type: match.job.type,
              posted: match.job.posted,
              url: match.job.url,
              source: match.job.source,
              tags: match.job.tags,
              matchScore: match.matchScore,
              matchReasons: match.matchReasons,
              status: match.status,
              createdAt: match.createdAt,
            })),
          };

          const jsonContent = JSON.stringify(jobsData, null, 2);
          const jsonFileName = `${userId}/jobs-${Date.now()}.json`;

          const { error: jsonUploadError } = await supabase.storage
            .from('Resume')
            .upload(jsonFileName, jsonContent, {
              contentType: 'application/json',
              upsert: true,
            });

          if (jsonUploadError) {
            console.error('Error uploading jobs JSON:', jsonUploadError);
          } else {
            const { data: jsonUrlData } = supabase.storage
              .from('Resume')
              .getPublicUrl(jsonFileName);
            console.log('Jobs JSON saved:', jsonUrlData.publicUrl);
          }
        } catch (jsonError) {
          console.error('Error creating jobs JSON:', jsonError);
          // Don't fail the upload if JSON save fails
        }

        // Update analytics
        const analytics = await dataStore.getAnalytics(userId);
        await dataStore.updateAnalytics(userId, {
          totalJobsMatched: analytics.totalJobsMatched + jobMatches.length,
        });

        // Add activity log for job discovery
        await dataStore.addActivity(userId, {
          action: 'Discovered jobs',
          item: `${jobMatches.length} matching opportunities`,
          timestamp: new Date(),
        });
      }
    } catch (jobError) {
      console.error('Background: Error searching/matching jobs:', jobError);
    }
  } catch (error) {
    console.error('Background: Job processing failed:', error);
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

    const resume = await dataStore.getResume(userId);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resume,
    });
  } catch (error: any) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

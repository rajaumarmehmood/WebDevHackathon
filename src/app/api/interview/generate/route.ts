import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewPrep } from '@/lib/gemini';
import { dataStore } from '@/lib/dataStoreSupabase';
import { InterviewPrep } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, technologies } = body;

    if (!userId || !role || !technologies) {
      return NextResponse.json(
        { error: 'User ID, role, and technologies are required' },
        { status: 400 }
      );
    }

    console.log(`Generating interview prep for role: ${role}`);

    // Generate interview prep material using AI
    const material = await generateInterviewPrep(role, technologies);

    // Create interview prep object
    const interviewPrep: InterviewPrep = {
      id: `prep-${Date.now()}`,
      userId,
      company: 'General', // Generic since we removed company-specific prep
      role,
      technologies,
      createdAt: new Date(),
      material,
    };

    // Save to data store
    await dataStore.saveInterviewPrep(interviewPrep);

    // Add activity log
    await dataStore.addActivity(userId, {
      action: 'Generated interview prep',
      item: role,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: interviewPrep,
    });
  } catch (error: any) {
    console.error('Error generating interview prep:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate interview prep' },
      { status: 500 }
    );
  }
}

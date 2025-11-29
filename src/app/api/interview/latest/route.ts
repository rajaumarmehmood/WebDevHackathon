import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStoreSupabase';

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

    // Get the latest interview prep for the user
    const preps = await dataStore.getInterviewPreps(userId);

    if (!preps || preps.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    // Return the most recent prep
    const latestPrep = preps[0];

    return NextResponse.json({
      success: true,
      data: latestPrep,
    });
  } catch (error: any) {
    console.error('Error fetching latest interview prep:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch interview prep' },
      { status: 500 }
    );
  }
}

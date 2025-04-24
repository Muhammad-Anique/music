// app/api/format-job/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { formatJobListing } from '@/utils/actions/jobs/ai'; // adjust path as needed
import { AIConfig } from '@/utils/ai-tools';

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, config }: { jobDescription: string; config: AIConfig } = await req.json();

    const formattedJob = await formatJobListing(jobDescription, config);

    return NextResponse.json({ success: true, formattedJob });
  } catch (error) {
    console.error('Error formatting job:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

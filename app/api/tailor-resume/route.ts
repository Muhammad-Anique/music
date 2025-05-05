import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { tailorResumeToJob } from '@/utils/actions/jobs/ai'; // Adjust path as needed

const requestSchema = z.object({
  resume: z.any(), // Ideally use a stricter schema if available
  jobListing: z.any(), // Or `z.infer<typeof simplifiedJobSchema>` if accessible here
  config: z.optional(z.any()), // Adjust schema for config if needed
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { resume, jobListing, config } = requestSchema.parse(body);

    const tailoredResume = await tailorResumeToJob(resume, jobListing, {
        model: 'gpt-4o-mini',
        apiKeys: [
          {
            service: 'openai',
            key: process.env.OPENAI_API_KEY!,
          },
        ],
      });

    return NextResponse.json({ success: true, resume: tailoredResume });
  } catch (error) {
    console.error('[TAILOR_RESUME_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Resume tailoring failed', error: `${error}` },
      { status: 500 }
    );
  }
};

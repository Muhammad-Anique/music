// /app/api/import-text/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addTextToResume } from '@/utils/actions/resumes/ai'; // adjust path based on your structure
import { Resume } from "@/lib/types";
// import { AIConfig } from '@/types'; // if applicable

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const schema = z.object({
      content: z.string(),
      resume: z.any(), // or better: z.custom<Resume>(),
    });

    const { content, resume } = schema.parse(body);

    const updatedResume = await addTextToResume(content, resume, {
      model: 'gpt-4o-mini',
      apiKeys: [{ service: 'openai', key: process.env.OPENAI_API_KEY! }],
    });

    return NextResponse.json({ success: true, resume: updatedResume });
  } catch (error) {
    console.error('[IMPORT_TEXT_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Import failed', error: `${error}` }, { status: 500 });
  }
};

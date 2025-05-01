// app/api/generate-cover-letter/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { job, resume, customPrompt } = body;

    const prompt = `Write a professional cover letter for the following job using my resume information:
${JSON.stringify(job)}

${JSON.stringify(resume)}

Today's date is ${new Date().toLocaleDateString()}.

Please use my contact information in the letter:
Full Name: ${resume.first_name} ${resume.last_name}
Email: ${resume.email}
${resume.phone_number ? `Phone: ${resume.phone_number}` : ''}
${resume.linkedin_url ? `LinkedIn: ${resume.linkedin_url}` : ''}
${resume.github_url ? `GitHub: ${resume.github_url}` : ''}

${customPrompt ? `\nAdditional requirements: ${customPrompt}` : ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // or 'gpt-3.5-turbo' if you're not using GPT-4
        messages: [
          {
            role: 'system',
            content: 'You are an expert career assistant helping generate cover letters.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    const coverLetter = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.error('API error generating cover letter:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}

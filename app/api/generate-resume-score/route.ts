import { NextRequest, NextResponse } from "next/server";
import { generateResumeScore } from "@/utils/actions/resumes/actions"; // Adjust path if needed
import { Resume } from "@/lib/types"; // Replace with actual type location
import { AIConfig } from "@/utils/ai-tools";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract resume and optional config from request
    const { resume, config } = body as {
      resume: Resume;
      config?: AIConfig;
    };

    if (!resume) {
      return NextResponse.json(
        { error: "Missing resume in request body." },
        { status: 400 }
      );
    }

    const score = await generateResumeScore(resume, config);

    return NextResponse.json(score, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume score", detail: error.message },
      { status: 500 }
    );
  }
}

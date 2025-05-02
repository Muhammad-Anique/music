import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse incoming JSON body
    const body = await req.json();
    const { jobTitle, jobDescription } = body;

    // Check if the required fields are provided
    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle and jobDescription." },
        { status: 400 }
      );
    }

    // Create the prompt for OpenAI API
    const prompt = `
You are a system that receives a job title and description. Your task is to generate a PLA: Professional Learning Ability Test.

Objective:
To assess a candidate's ability to quickly learn and effectively apply new skills and knowledge relevant to their role.

Requirements:
- 5 questions total.
- 2 scenario-based questions.
- 3 concept/retention/understanding questions.
- Return a JSON array where each question includes both the question and its answer.
STRICT FORMAT ONLY.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Return only a JSON array of questions with answers like:
[
  {
    "question": "What is X?",
    "answer": "X is..."
  },
  ...
]
`;

    // Call the OpenAI API to generate the questions
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that generates high-quality professional learning ability tests based on job descriptions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    // Check if the response from OpenAI is successful
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.error?.message || "OpenAI API returned an error.";
      throw new Error(errorMessage);
    }

    // Parse the response from OpenAI
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim() || "[]";
    
    // Try parsing the raw content into a valid JSON array
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(rawContent);
    } catch (err) {
      throw new Error("Failed to parse the OpenAI response into JSON.");
    }
    console.log("Parsed Questions:", parsedQuestions);

    // Return the generated questions as a JSON response
    return NextResponse.json({ questions: parsedQuestions });
  } catch (error) {
    console.error("API error generating test:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate test";

    // Return the error message as a JSON response with status 500
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

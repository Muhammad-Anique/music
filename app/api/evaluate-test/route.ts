import { NextRequest, NextResponse } from "next/server";

// Define types for better code clarity
type Question = {
  question: string;
  answer: string;
};

type CandidateAnswer = {
  question: string;
  answer: string;
};

type EvaluationResult = {
  question: string;
  modelAnswer: string;
  candidateAnswer: string;
  score: number; // 0-10 scale
  feedback: string;
};

export async function POST(req: NextRequest) {
  try {
    // Parse incoming JSON body
    const body = await req.json();
    const { questions, candidateAnswers } = body;

    // Check if the required fields are provided
    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid questions. Must provide an array of questions with answers.",
        },
        { status: 400 }
      );
    }

    if (!candidateAnswers || !Array.isArray(candidateAnswers)) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid candidateAnswers. Must provide an array of answers.",
        },
        { status: 400 }
      );
    }

    // Evaluate the candidate's answers against the provided questions/answers
    const evaluationResults = await evaluateAnswers(
      questions,
      candidateAnswers
    );

    // Calculate overall score
    const totalScore = evaluationResults.reduce(
      (sum, result) => sum + result.score,
      0
    );
    const averageScore = totalScore / evaluationResults.length;

    // Return the evaluation results
    return NextResponse.json({
      results: evaluationResults,
      overallScore: averageScore.toFixed(1),
    });
  } catch (error) {
    console.error("API error in evaluation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to evaluate answers";

    // Return the error message as a JSON response with status 500
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Function to evaluate candidate answers against the model answers
async function evaluateAnswers(
  questions: Question[],
  candidateAnswers: CandidateAnswer[]
): Promise<EvaluationResult[]> {
  // Prepare the evaluation prompt
  const evaluationPrompt = `
You are an expert interviewer evaluating a candidate's answers to a professional test.

Please evaluate each of the candidate's answers against the model answers provided. For each answer:
1. Rate it on a scale of 0-10 where 10 is perfect
2. Provide brief, constructive feedback explaining the score
3. Be fair but rigorous in your assessment

Here are the questions, model answers, and candidate's responses:
${questions
  .map((q, i) => {
    // Find the matching candidate answer by question text
    const candidateResponse = candidateAnswers.find(
      (ca) => ca.question === q.question
    ) || { question: q.question, answer: "No answer provided" };

    return `
Question ${i + 1}: ${q.question}
Model Answer: ${q.answer}
Candidate's Answer: ${candidateResponse.answer}
`;
  })
  .join("\n")}

Provide your evaluation in JSON format:
[
  {
    "question": "Question text here",
    "score": 8,
    "feedback": "Strong understanding demonstrated, but missed the key point about X..."
  },
  ...
]
`;

  // Call OpenAI API for evaluation
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
            "You are an expert interviewer assessing candidates' responses with fairness and precision.",
        },
        {
          role: "user",
          content: evaluationPrompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent evaluations
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.error?.message ||
      "OpenAI API returned an error during evaluation.";
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content?.trim() || "[]";

  // Parse the evaluation results
  let parsedEvaluation;
  try {
    parsedEvaluation = JSON.parse(rawContent);
  } catch (err) {
    throw new Error("Failed to parse the evaluation response into JSON.");
  }

  // Combine the evaluation results with the original questions and answers
 return parsedEvaluation.map((evaluation: any, index: number) => {
   const question = questions[index];
   const candidateAnswer = candidateAnswers.find(
     (ca) => ca.question === question.question
   ) || { question: question.question, answer: "No answer provided" };

   return {
     question: question.question,
     modelAnswer: question.answer,
     candidateAnswer: candidateAnswer.answer,
     score: evaluation.score || 0,
     feedback: evaluation.feedback || "No feedback provided",
   };
 });

}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!id) return;

    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching interview:", error);
        return;
      }

      let parsedQuestions = data.questions;
      if (typeof parsedQuestions === "string") {
        try {
          parsedQuestions = JSON.parse(parsedQuestions);
        } catch (e) {
          console.error("Failed to parse questions JSON:", e);
          parsedQuestions = [];
        }
      }

      setData({
        ...data,
        questions: parsedQuestions,
      });
    };

    fetchInterview();
  }, [id]);

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      // Prepare the payload to send
      const payload = {
        questions: data.questions.map((q: any) => ({
          question: q.question,
          answer: q.answer,
        })),
        candidateAnswers: data.questions.map((q: any, index: number) => ({
          question: q.question,
          answer: answers[index] || "No answer provided",
        })),
      };

      console.log("Payload sent to API:", payload);

      // Send the answers to the API endpoint
      const response = await fetch("/api/evaluate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        throw new Error(`Failed to evaluate: ${errorResponse.error}`);
      }

      const result = await response.json();
      console.log("Evaluation Result:", result);
      setEvaluationResult(result.results);

      setLoading(false);
    } catch (error) {
      console.error("Evaluation error:", error);
      setLoading(false);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-700 mb-6">{data.description}</p>
      <div className="space-y-4">
        {Array.isArray(data.questions) &&
          data.questions.map((q: any, index: number) => (
            <div key={index} className="p-4 border rounded bg-gray-50">
              <p className="font-semibold">{q.question}</p>
              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                className="mt-2 w-full p-2 border rounded"
                placeholder="Your answer..."
              />
            </div>
          ))}
      </div>
      <div className="mt-6">
        <Button
          onClick={handleEvaluate}
          disabled={loading}
          className="bg-blue-900 text-white"
        >
          {loading ? "Evaluating..." : "Evaluate"}
        </Button>

        {evaluationResult && (
          <div className="mt-4 space-y-4">
            {evaluationResult.map((result: any, index: number) => (
              <div key={index} className="p-4 border rounded bg-green-50">
                <p className="font-semibold">{result.question}</p>
                <p>
                  <span className="font-bold">Score:</span> {result.score}
                  <span>/10</span>
                </p>
                <p>
                  <span className="font-bold">Feedback:</span> {result.feedback}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

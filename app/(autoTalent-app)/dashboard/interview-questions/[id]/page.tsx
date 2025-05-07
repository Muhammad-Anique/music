"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

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

  const handleEvaluate = async () => {
    router.push(`/dashboard/interview-questions/${id}/evaluation`);
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
              <p className="text-gray-600">{q.answer}</p>
            </div>
          ))}
      </div>
      <div className="mt-6">
        <Button
          onClick={handleEvaluate}
          disabled={loading}
          className="bg-blue-900 text-white"
        >
          {loading ? "Evaluating..." : "Take Test"}
        </Button>
        {evaluationResult && (
          <p className="mt-4 text-green-600">{evaluationResult}</p>
        )}
      </div>
    </div>
  );
}

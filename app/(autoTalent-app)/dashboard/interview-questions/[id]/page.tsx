"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

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

      // Ensure questions is parsed if it's stored as a string
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
    </div>
  );
}

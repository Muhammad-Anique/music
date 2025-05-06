"use client";

import { useState, useEffect } from "react";
import InterviewCard from "@/components/interview-question/InterviewCard";
import { supabase } from "@/lib/supabase/client";

type InterviewItem = {
  id: string;
  title: string;
  description: string;
};

export default function InterviewPage() {
  const [interviewList, setInterviewList] = useState<InterviewItem[]>([]);
  const [showModal, setShowModal] = useState(false); // <-- Default is false now
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    const fetchInterviewQuestions = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("interview_questions")
        .select("id, title, description")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching interview questions:", error);
        return;
      }

      if (data) {
        setInterviewList(data);
      }
    };

    fetchInterviewQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) return;

    try {
      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription }),
      });

      const data = await res.json();

      if (data.questions) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Failed to get user:", userError);
          return;
        }

        localStorage.setItem(
          `interview-${jobTitle.toLowerCase().replace(/\s+/g, "-")}`,
          JSON.stringify(data.questions)
        );

        const { data: insertedData, error: insertError } = await supabase
          .from("interview_questions")
          .insert([
            {
              title: jobTitle,
              description: jobDescription,
              questions: data.questions,
              user_id: user?.id,
            },
          ])
          .select("id, title, description")
          .single();

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          return;
        }

        if (insertedData) {
          setInterviewList((prev) => [...prev, insertedData]);
        }

        setJobTitle("");
        setJobDescription("");
        setShowModal(false); // close modal after submit
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  return (
    <>
      {/* Create New Button */}
      <div className="p-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
        >
          + Create New
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Generate Interview Test
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full border p-2 rounded"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-all duration-300"
              >
                Generate Test
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Interview Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {interviewList.map(({ id, title, description }) => (
          <InterviewCard
            key={id}
            id={id}
            title={title}
            description={description}
          />
        ))}
      </div>
    </>
  );
}

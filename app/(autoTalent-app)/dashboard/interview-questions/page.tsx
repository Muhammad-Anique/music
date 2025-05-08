"use client";

import { useState, useEffect } from "react";
import InterviewCard from "@/components/interview-question/InterviewCard";
import { supabase } from "@/lib/supabase/client";
import { useLoading } from "@/context/LoadingContext";

type InterviewItem = {
  id: string;
  title: string;
  description: string;
};

export default function InterviewPage() {
  const [interviewList, setInterviewList] = useState<InterviewItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const { setIsLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    setGlobalLoading(false);

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

    // Set loading state to true
    setIsLoading(true);

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
        setShowModal(false); // Close the modal after generating the test
      }
    } catch (err) {
      console.error("API call failed:", err);
    } finally {
      // Set loading state to false after the test is generated and modal is closed
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Create New Button */}
      <div className="p-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#38b6ff] text-white px-4 py-2 rounded transition-all duration-300"
        >
          + Create New
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Generate Interview Test
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full hover:bg-blue-500 bg-[#38b6ff] text-white p-3 rounded-lg transition-all duration-300 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <div
                      className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin mr-2"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                    Generating...
                  </>
                ) : (
                  "Generate Test"
                )}
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 p-3 rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Interview Cards */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
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

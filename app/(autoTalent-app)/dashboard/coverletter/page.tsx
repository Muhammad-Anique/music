"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import CoverLetterCard from "@/components/cover-letter/CoverLetterCard";
import CoverLetterFormModal from "@/components/cover-letter/CoverLetterFormModal";
import { useLoading } from "@/context/LoadingContext";
interface CoverLetter {
  id: string;
  title: string;
  context: string;
}

const CoverLettersPage = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoading();
  const fetchCoverLetters = async () => {
    const { data, error } = await supabase.from("cover_letters").select("*");
    if (data) setCoverLetters(data as CoverLetter[]);
    if (error) setError("Failed to fetch cover letters");
  };

  useEffect(() => {
    setIsLoading(false);
    fetchCoverLetters();

    
  }, []);

  const handleCreateCoverLetter = async (
    title: string,
    jobDescription: string,
    tone: number
  ) => {
    try {
      setLoading(true);
      setError(null);
  
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError || !user) {
        throw new Error("User not authenticated");
      }
  
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, jobDescription, tone }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate cover letter");
      }
  
      const generatedContent = result.coverLetter || result.context;

      // Insert into Supabase with user_id
      const { error: insertError } = await supabase
        .from("cover_letters")
        .insert({
          title,
          context: generatedContent,
          user_id: user.id,
        });
  
      if (insertError) {
        throw new Error("Failed to save cover letter to Supabase");
      }
  
      await fetchCoverLetters();
      setIsModalOpen(false);
    } catch (err) {
      setLoading(false);
      
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError('An unexpected error occurred.');
      }
  
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold mb-6">Cover Letters</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 hover:bg-blue-500 bg-[#38b6ff] text-white rounded-lg mb-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "New Cover Letter"}
      </button>

      {loading && (
        <p className="text-gray-500">Please wait, generating letter...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coverLetters.map((coverLetter) => (
          <CoverLetterCard
            key={coverLetter.id}
            id={coverLetter.id}
            title={coverLetter.title}
            context={coverLetter.context}
          />
        ))}
      </div>

      <CoverLetterFormModal
        modalTitle="Create New Cover Letter"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCoverLetter}
      />
    </div>
  );
};

export default CoverLettersPage;

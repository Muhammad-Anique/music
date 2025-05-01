"use client"
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import CoverLetterCard from "@/components/cover-letter/CoverLetterCard";
import CoverLetterFormModal from "@/components/cover-letter/CoverLetterFormModal";

const CoverLettersPage = () => {
  const [coverLetters, setCoverLetters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCoverLetters = async () => {
      const { data } = await supabase.from("cover_letters").select("*");
      setCoverLetters(data);
    };
    fetchCoverLetters();
  }, []);

  const handleCreateCoverLetter = async (
    title: string,
    jobDescription: string,
    tone: number
  ) => {
    const { data, error } = await supabase
      .from("cover_letters")
      .insert([{ title, context: jobDescription, tone }]);

    if (data) {
      setCoverLetters((prev) => [...prev, ...data]);
    }

    if (error) {
      console.error("Error inserting cover letter:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold mb-6">Cover Letters</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
      >
        New Cover Letter
      </button>

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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCoverLetter}
      />
    </div>
  );
};

export default CoverLettersPage;

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import CoverLetterFormModal from "@/components/cover-letter/CoverLetterFormModal";
import EmailCard from "@/components/emails/emails-card";
import { useLoading } from "@/context/LoadingContext";
interface Email {
  id: string;
  title: string;
  subject: string;
  content: string;
}

const CoverLettersPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const { setIsLoading } = useLoading();
  const fetchEmails = async () => {
    const { data, error } = await supabase.from("email_hr").select("*");
    console.log("Fetched Emails:", data, error);

    if (error) {
      setError("Failed to fetch cover letters");
    } else {
      const parsedData = data.map((email: any) => {
        let parsedContent = { subject: "", body: "" };
        try {
          parsedContent = JSON.parse(email.content);
        } catch (e) {
          console.error("Failed to parse content:", e);
        }

        return {
          ...email,
          parsedSubject: parsedContent.subject,
          parsedBody: parsedContent.body,
        };
      });

      setEmails(parsedData as Email[]);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    fetchEmails();
  }, []);

  const handleCreateCoverLetter = async (
    title: string,
    jobDescription: string,
    tone: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/email-hr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, jobDescription, tone }),
      });

      const result = await response.json();

      console.log("API Response:", result);
      //   if (!response.ok || !result.body || !result.subject) {
      //     throw new Error(result.error || "Failed to generate email");
      //   }

      const { subject, content } = result;
      const { error: insertError } = await supabase.from("email_hr").insert({
        title: title,
        subject: subject,
        content: content,
        user_id: user.id,
      });

      if (insertError) {
        throw new Error("Failed to save email to Supabase");
      }

      await fetchEmails();
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold mb-6">Emails To HR</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-[#38b6ff]  hover:bg-blue-500 text-white rounded-lg mb-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "New Email To HR"}
      </button>

      {loading && (
        <p className="text-gray-500">Please wait, generating email...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {emails.map((email) => (
          <EmailCard
            key={email.id}
            id={email.id}
            subject={email.subject} // Pass the subject to EmailCard
            body={email.content} // Pass the body to EmailCard (assuming 'context' is the body)
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

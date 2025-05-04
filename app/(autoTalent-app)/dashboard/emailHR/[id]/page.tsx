"use client";
import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams instead of useRouter

export default function EmailHRDetail() {
  const [updatedEmail, setUpdatedEmail] = useState<any>(null);
  const { id } = useParams(); // Initialize the useParams hook to access the route params

  useEffect(() => {
    if (!id) return; // Don't attempt to fetch until the id is available

    const fetchEmail = async () => {
      const { data: email, error } = await supabase
        .from("email_hr")
        .select("*")
        .eq("id", id) // Use the `id` from the query parameters
        .single();

      if (error || !email) {
        notFound(); // Show 404 if not found
        return;
      }

      setUpdatedEmail(email);
    };

    fetchEmail();
  }, [id]); // Re-fetch when `id` changes

  const handleRegenerate = async () => {
    try {
      // Assuming `updatedEmail.title` and `updatedEmail.job_description` are correct
      const response = await fetch("/api/email-hr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedEmail.title, // Pass the email's title
          jobDescription: updatedEmail.job_description, // Pass the job description
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate email");
      }

      const newEmail = await response.json();
      setUpdatedEmail(newEmail); // Update the email content with the regenerated data
    } catch (error) {
      console.error("Error regenerating email:", error);
      alert("An error occurred while regenerating the email.");
    }
  };

  if (!updatedEmail) return <div>Loading...</div>; // Show a loading message until email data is fetched

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{updatedEmail.title}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{updatedEmail.subject}</h2>

      <div className="bg-white border p-4 rounded whitespace-pre-wrap font-mono">
        {updatedEmail.content}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigator.clipboard.writeText(updatedEmail.content)}
        >
          Copy
        </button>

        {/* <button
          onClick={handleRegenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Regenerate
        </button> */}
      </div>
    </div>
  );
}

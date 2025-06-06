// app/(autoTalent-app)/dashboard/coverletter/[id]/page.tsx
"use client"; // Explicitly mark as a Client Component

import { FC, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation"; // Correct way to get dynamic parameters
import { jsPDF } from "jspdf";

const EditCoverLetterPage: FC = () => {
  const { id } = useParams(); // Get the dynamic 'id' from params

  const [coverLetter, setCoverLetter] = useState({ title: "", context: "" });
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only fetch the cover letter once `id` is available
  useEffect(() => {
    if (id) {
      fetchCoverLetter();
    }
  }, [id]); // Add id as dependency

  const fetchCoverLetter = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    const { data, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setError(error.message); // Set error message
      console.error("Error fetching cover letter:", error.message);
    } else {
      setCoverLetter(data);
      setEditedContent(data.context);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("cover_letters")
      .update({ context: editedContent })
      .eq("id", id);

    if (error) {
      console.error("Error saving cover letter:", error.message);
      alert("Error saving cover letter. Please try again.");
    } else {
      alert("Cover letter saved!");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 10;
    const maxWidth = pageWidth - margin * 2;
  
    // Draw a colored header background
    doc.setFillColor(63, 81, 181); // Indigo 500
    doc.rect(0, 0, pageWidth, 30, 'F');
  
    // Title styling
    doc.setTextColor(255, 255, 255); // White
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(coverLetter.title, margin, 20);
  
    // Reset for body text
    doc.setTextColor(33, 33, 33); // Almost black
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
  
    // Add body text with better spacing
    doc.text(editedContent, margin, 50, {
      maxWidth: maxWidth,
      lineHeightFactor: 1.6,
    });
  
    // Optional: draw a footer line
    doc.setDrawColor(200);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    // doc.text('Generated with love ❤️ using jsPDF', margin, pageHeight - 10);
  
    // Save the PDF
    doc.save(`${coverLetter.title}.pdf`);
  };
  
  // Loading or error state handling
  if (!id) return <p>Loading...</p>;
  if (loading) return <p>Loading cover letter...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 flex space-x-8">
      <div className="w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Edit Cover Letter</h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Title</label>
            <input
              type="text"
              value={coverLetter.title}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Content</label>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={10}
            />
          </div>
          <div className="space-x-4">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Download as PDF
            </button>
          </div>
        </form>
      </div>

      <div className="w-1/2 border-l border-gray-300 pl-6">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">{coverLetter.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{editedContent}</p>
        </div>
      </div>
    </div>
  );
};

export default EditCoverLetterPage;

// components/cover-letter/CoverLetterFormModal.tsx
import { useState } from "react";

interface CoverLetterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, jobDescription: string, tone: number) => void;
}

const CoverLetterFormModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CoverLetterFormModalProps) => {
  const [title, setTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState(5); // Default tone to 5 (neutral)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, jobDescription, tone);
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center  bg-opacity-100">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Cover Letter</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="tone"
              className="block text-sm font-medium text-gray-700"
            >
              Tone (1 = Formal, 10 = Casual)
            </label>
            <input
              id="tone"
              type="range"
              min="1"
              max="10"
              value={tone}
              onChange={(e) => setTone(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between">
              <span>1 (Formal)</span>
              <span>10 (Casual)</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoverLetterFormModal;

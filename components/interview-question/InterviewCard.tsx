"use client";

import { useState } from "react";
import Link from "next/link";

type InterviewCardProps = {
  id: string;
  title: string;
  description: string;
};

export default function InterviewCard({
  id,
  title,
  description,
}: InterviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

        <Link
          href={`/dashboard/interview-questions/${id}`}
          className={`block text-center py-2 px-4 rounded-md font-medium transition-all duration-300 ease-in-out ${
            isHovered ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"
          }`}
        >
          Start Interview
        </Link>
      </div>
    </div>
  );
}

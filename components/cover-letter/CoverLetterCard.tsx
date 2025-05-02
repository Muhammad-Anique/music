// components/CoverLetterCard.tsx
import { FC } from "react";
import Link from "next/link";

interface CoverLetterCardProps {
  id: string;
  title: string;
  context: string;
}

const CoverLetterCard: FC<CoverLetterCardProps> = ({ title, context, id }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{context.slice(0, 100)}...</p>
      <Link 
        href={`dashboard/coverletters/${id}`} 
        className="text-blue-500 mt-4 inline-block"
      >
        View Full Letter
      </Link>
    </div>
  );
};

export default CoverLetterCard;

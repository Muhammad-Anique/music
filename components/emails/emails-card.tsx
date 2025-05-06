// components/EmailCard.tsx
import { FC } from "react";
import Link from "next/link";

interface EmailCardProps {
  id: string;
  subject: string;
  body: string;
}

const EmailCard: FC<EmailCardProps> = ({ id, subject, body }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold">{subject}</h3>
      <p className="text-sm text-gray-600 mt-2">{body.slice(0, 100)}...</p>
      <Link
        href={`/dashboard/follow-up-email/${id}`}
        className="text-blue-500 mt-4 inline-block"
      >
        View Full Email
      </Link>
    </div>
  );
};

export default EmailCard;

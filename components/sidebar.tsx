"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Home,
  FileText,
  FileSignature,
  Mail,
  Globe,
  // UserCheck,
  Search,
  Bookmark,
  Rocket,
  Briefcase,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

  const links = [
    {
      name: "Job Hub",
      href: "/dashboard",
      icon: <Home className="w-6 h-6 mr-3" />,
    },
    {
      name: "Resume Builder",
      href: "/dashboard/resumes",
      icon: <FileText className="w-6 h-6 mr-3" />,
    },
    {
      name: "Cover Letter",
      href: "/dashboard/coverletter",
      icon: <FileSignature className="w-6 h-6 mr-3" />,
    },
    {
      name: "Job Interviews",
      href: "/dashboard/interviews",
      icon: <Mail className="w-6 h-6 mr-3" />,
    },
    {
      name: "Interview Buddy",
      href: "/dashboard/interview-buddy",
      icon: <Globe className="w-6 h-6 mr-3" />,
    },
    {
      name: "Search Jobs",
      href: "/dashboard/search-jobs",
      icon: <Search className="w-6 h-6 mr-3" />,
    },
    {
      name: "Saved Jobs",
      href: "/dashboard/saved-jobs",
      icon: <Bookmark className="w-6 h-6 mr-3" />,
    },
    {
      name: "Auto Apply",
      href: "/dashboard/auto-apply",
      icon: <Rocket className="w-6 h-6 mr-3" />,
    },
    // { name: 'Job Hub', href: '/dashboard/jobhub', icon: <Briefcase className="w-6 h-6 mr-3" /> },
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-r-gray-200 shadow-sm flex flex-col p-6">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-12 tracking-tight">
        <span className="font-semibold">Auto</span> Talent
      </h1>
      <nav className="flex-1">
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span className="font-semibold">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-12 flex items-center justify-center px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 text-base"
      >
        <LogOut className="w-5 h-5 mr-2" />
        <span className="font-semibold">Logout</span>
      </button>
    </aside>
  );
}

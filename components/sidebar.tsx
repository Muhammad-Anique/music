"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import {
  Home,
  FileText,
  FileSignature,
  Mail,
  Globe,
  Search,
  Bookmark,
  Rocket,
  LogOut,
  Brain,
  Briefcase,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleNavigation = (href: string) => {
    // Don't navigate if already on the page
    if (pathname === href) return;

    // Set loading state to true before navigation
    setIsLoading(true);

    // Navigate to the new page
    router.push(href);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
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
      name: "Email To HR",
      href: "/dashboard/follow-up-email",
      icon: <Mail className="w-6 h-6 mr-3" />,
    },
    {
      name: "Job Interviews",
      href: "/dashboard/interview-questions",
      icon: <Briefcase className="w-6 h-6 mr-3" />,
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
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-r-gray-200 shadow-lg flex flex-col p-6">
      <h1 className="text-3xl font-extrabold text-center text-[#38b6ff] flex flex-row items-center justify-center gap-0 mb-9 tracking-tight">
        <Brain className="w-10 h-10 mr-2" />
        <span className="text-center">autotalent</span>
      </h1>
      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <a
                onClick={() => handleNavigation(link.href)}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  pathname === link.href
                    ? "bg-gray-100 text-[#38b6ff]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span className="font-semibold">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-12 flex items-center justify-center px-5 py-3 bg-[#38b6ff] text-white rounded-md hover:bg-blue-500 text-base"
      >
        <LogOut className="w-5 h-5 mr-2" />
        <span className="font-semibold">Logout</span>
      </button>
    </aside>
  );
}

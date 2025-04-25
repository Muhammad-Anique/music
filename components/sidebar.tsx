'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Home,
  FileText,
  FileSignature,
  Mail,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  const links = [
    { name: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'Resume Builder', href: '/dashboard/resume', icon: <FileText className="w-5 h-5 mr-2" /> },
    { name: 'Cover Letter', href: '/dashboard/cover-letter', icon: <FileSignature className="w-5 h-5 mr-2" /> },
    { name: 'Email to HR', href: '/dashboard/email-hr', icon: <Mail className="w-5 h-5 mr-2" /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm flex flex-col p-6">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-8 tracking-tight">Auto Talent</h1>
      <nav className="flex-1">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-8 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </aside>
  );
}

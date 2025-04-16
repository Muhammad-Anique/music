'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  const links = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Resume Builder', href: '/dashboard/resume' },
    { name: 'Cover Letter', href: '/dashboard/cover-letter' },
    { name: 'Email to HR', href: '/dashboard/email-hr' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm flex flex-col p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Auto Talent</h1>
      <nav className="flex-1">
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
      >
        Logout
      </button>
    </aside>
  );
}

import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row min-h-screen overflow-hidden">
     <div className='overflow-hidden fixed'>
       <Sidebar />
     </div>
      <main className="flex-1 ml-72 bg-gray-50 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}

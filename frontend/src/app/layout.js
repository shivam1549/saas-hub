"use client"; // Must be a client component to use usePathname

import './globals.css';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import EchoStatusBadge from '@/components/EchoStatusBadge';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Define which paths should NOT have the sidebar/navbar
  const isAuthPage = pathname === '/login';

  return (
    <html lang="en">
      <body className="antialiased">
        {isAuthPage ? (
          // 1. Plain Layout for Login
          <main className="min-h-screen bg-slate-50">
            {children}
          </main>
        ) : (
          // 2. Full App Layout with Sidebar/Navbar
          <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
          </div>
        )}
        {/* Echo Connection Status Badge - Always visible */}
        <EchoStatusBadge />
      </body>
    </html>
  );
}
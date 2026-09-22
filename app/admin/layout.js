'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Don't guard the login page
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      return;
    }

    if (!isAdmin) {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router, isAdmin]);

  if (!mounted || !isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If it's the login page, just render the content without sidebar/topbar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden text-gray-900 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopBar />
        
        {/* Mobile Warning Banner */}
        <div className="md:hidden bg-yellow-50 border-b border-yellow-200 p-3 text-center">
          <p className="text-yellow-800 text-xs font-bold">
            For best experience, use a tablet or larger screen.
          </p>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminTopBar() {
  const pathname = usePathname();
  const [time, setTime] = useState(new Date());
  
  // To avoid hydration mismatch, only render the clock on client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case '/admin': return 'Live Dashboard';
      case '/admin/menu': return 'Menu Management';
      case '/admin/reports': return 'Sales Reports';
      default: return 'Operations Panel';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-6">
        {mounted && (
          <div className="text-sm font-semibold text-gray-600 bg-gray-50 px-4 py-1.5 rounded-lg border border-gray-100 min-w-[200px] text-center">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        )}
      </div>
    </header>
  );
}

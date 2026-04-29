'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Menu as MenuIcon, BarChart3, LogOut, ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Live Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Menu Management', path: '/admin/menu', icon: MenuIcon },
    { name: 'Sales Reports', path: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <aside 
      className={`bg-[#1E1E2E] text-gray-300 transition-all duration-300 flex flex-col h-screen sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className="h-auto flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {!isCollapsed && (
          <Link href="/admin" className="flex flex-col leading-tight truncate">
            <span className="font-black text-white text-base tracking-tight">{process.env.NEXT_PUBLIC_CANTEEN_NAME || 'CANTEEN'}</span>
            <span className="text-[10px] font-semibold text-gray-500 tracking-wide">theCanteen.online</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/admin" className="w-full flex justify-center text-primary">
            <UtensilsCrossed size={24} />
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-gray-500 hover:text-white transition-colors ${isCollapsed ? 'hidden' : 'block'}`}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-10 w-full flex items-center justify-center text-gray-500 hover:text-white transition-colors border-b border-gray-800"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Nav Links */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'hover:bg-gray-800 hover:text-white font-medium'
              } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-400'} />
              {!isCollapsed && <span>{item.name}</span>}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-md" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors w-full ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

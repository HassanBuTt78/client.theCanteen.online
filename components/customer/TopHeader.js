'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, LogOut } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function TopHeader() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getCartCount());

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'My Orders', path: '/my-orders' },
  ];

  return (
    <header className="hidden md:flex sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm h-16 w-full justify-center">
      <div className="flex items-center justify-between w-full max-w-5xl px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-lg font-black tracking-tight text-foreground">{process.env.NEXT_PUBLIC_CANTEEN_NAME || 'CANTEEN'}</span>
          <span className="text-[10px] font-semibold text-gray-400 tracking-wide">theCanteen.online</span>
        </Link>

        <nav className="flex items-center gap-8 font-semibold text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={isActive ? 'text-primary' : 'text-text-muted hover:text-foreground transition-colors'}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          <button className="text-text-muted hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-semibold">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

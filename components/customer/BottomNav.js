'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coffee, ClipboardList, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getCartCount());

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/menu', icon: Coffee },
    { name: 'My Orders', path: '/my-orders', icon: ClipboardList },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-safe z-50 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center justify-center w-16 gap-1 relative ${
              isActive ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <div className="relative">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {item.name === 'Cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

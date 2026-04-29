'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FoodCard from '../../components/customer/FoodCard';
import { menuItems } from '../../data/menuItems';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted) return null; // Avoid hydration mismatch

  const categories = ['Snacks', 'Drinks', 'Meals', 'Desserts'];
  const featuredItems = menuItems.slice(0, 5); // Take first 5 as featured

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black">Good morning, Ali 👋</h1>
        <p className="text-text-muted mt-1">What are you craving today?</p>
      </header>

      <section className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => router.push(`/menu?category=${cat}`)}
              className="bg-white border border-gray-100 hover:border-primary/50 shadow-sm px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap active:scale-95 transition-all text-foreground"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold">Popular Right Now</h2>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
          {featuredItems.map((item) => (
            <div key={item.id} className="min-w-[200px] w-[200px] snap-start">
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}

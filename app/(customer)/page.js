'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FoodCard from '../../components/customer/FoodCard';
import HeroCarousel from '../../components/customer/HeroCarousel';
import { getMenuItems } from '../../lib/api/menu';

export default function HomePage() {
  const router = useRouter();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Grab the user's name from auth store if logged in
    try {
      const stored = localStorage.getItem('canteen_user');
      if (stored) {
        const user = JSON.parse(stored);
        setUserName(user.name || '');
      }
    } catch {}

    // Fetch all available menu items
    getMenuItems({ available: true })
      .then((items) => {
        setAllItems(items);
      })
      .catch(() => {
        // Fallback silently
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Snacks', 'Drinks', 'Meals', 'Desserts'];
  const greeting = userName ? `Good morning, ${userName.split(' ')[0]}` : 'What are you craving today?';
  const subtitle = userName ? 'What are you craving today?' : 'Order ahead, skip the queue.';

  // Split items for different sections
  const heroItems = allItems.slice(0, 5);
  const browseItems = allItems.slice(5);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black">{greeting}</h1>
        <p className="text-text-muted mt-1">{subtitle}</p>
      </header>

      {/* Hero Carousel */}
      {!loading && heroItems.length > 0 && (
        <HeroCarousel items={heroItems} />
      )}

      {/* Loading state for hero */}
      {loading && (
        <div className="rounded-2xl bg-gray-100 h-[280px] md:h-[340px] animate-pulse mb-8" />
      )}

      {/* Category Pills */}
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

      {/* Browse Menu — horizontal scroll */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold">Browse Menu</h2>
          <Link href="/menu" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[200px] w-[200px] bg-gray-100 rounded-2xl h-48 animate-pulse snap-start" />
            ))}
          </div>
        ) : browseItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {browseItems.map((item) => (
              <div key={item._id} className="min-w-[200px] w-[200px] snap-start">
                <FoodCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[200px] w-[200px] bg-gray-100 rounded-2xl h-48 animate-pulse snap-start" />
            ))}
          </div>
        )}
      </section>



      {/* Browse Full Menu CTA */}
      <section className="mb-4">
        <Link
          href="/menu"
          className="block w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center active:scale-[0.98] transition-transform hover:border-primary/30"
        >
          <p className="font-bold text-foreground">Browse Full Menu</p>
          <p className="text-text-muted text-sm mt-1">View all available items and categories</p>
        </Link>
      </section>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
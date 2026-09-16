'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FoodCard from '../../components/customer/FoodCard';
import { getMenuItems } from '../../lib/api/menu';

export default function HomePage() {
  const router = useRouter();
  const [featuredItems, setFeaturedItems] = useState([]);
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

    // Fetch featured menu items
    getMenuItems({ available: true })
      .then((items) => {
        setFeaturedItems(items.slice(0, 5));
      })
      .catch(() => {
        // Fallback silently — show nothing
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Snacks', 'Drinks', 'Meals', 'Desserts'];
  const greeting = userName ? `Good morning, ${userName.split(' ')[0]} 👋` : 'What are you craving today?';

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black">{greeting}</h1>
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
        
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[200px] w-[200px] bg-gray-100 rounded-2xl h-48 animate-pulse snap-start" />
            ))}
          </div>
        ) : featuredItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {featuredItems.map((item) => (
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
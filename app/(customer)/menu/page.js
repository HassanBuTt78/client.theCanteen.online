'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import FoodCard from '../../../components/customer/FoodCard';
import EmptyState from '../../../components/customer/EmptyState';
import { getMenuItems } from '../../../lib/api/menu';

function MenuContent() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'All';
  
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Snacks', 'Drinks', 'Meals', 'Desserts'];

  useEffect(() => {
    setLoading(true);
    setError('');
    
    const filters = {};
    if (activeCategory !== 'All') filters.category = activeCategory;
    if (searchQuery) filters.search = searchQuery;

    getMenuItems(filters)
      .then(setItems)
      .catch((err) => {
        setError(err.message || 'Failed to load menu');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for food..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setActiveCategory('All');
          }}
          className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 text-sm font-semibold"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSearchQuery('');
            }}
            className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-100 text-text-muted hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-56 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 font-bold mb-2">Failed to load menu</p>
          <p className="text-sm text-text-muted">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Try again
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <FoodCard key={item.id || item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No items found" 
          subtitle="Try adjusting your search or category filter to find what you're looking for." 
        />
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import FoodCard from '../../../components/customer/FoodCard';
import EmptyState from '../../../components/customer/EmptyState';
import { menuItems } from '../../../data/menuItems';

function MenuContent() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'All';
  
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Snacks', 'Drinks', 'Meals', 'Desserts'];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <FoodCard key={item.id} item={item} />
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

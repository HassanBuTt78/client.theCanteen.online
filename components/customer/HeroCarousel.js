'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

const INTERVAL = 5000; // 5 seconds auto-advance

export default function HeroCarousel({ items }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const cartItems = useCartStore((state) => state.cartItems);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const count = items.length;

  const goTo = useCallback((idx, dir) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % count, 1);
  }, [current, count, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + count) % count, -1);
  }, [current, count, goTo]);

  // Auto-advance
  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next, count]);

  if (!items || items.length === 0) return null;

  const item = items[current];
  const cartItem = cartItems.find((i) => i._id === item._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => addItem(item);
  const handleInc = () => updateQuantity(item._id, quantity + 1);
  const handleDec = () => updateQuantity(item._id, quantity - 1);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-8">
      {/* Slides */}
      <div className="relative h-[280px] md:h-[340px]">
        {items.map((slideItem, idx) => (
          <div
            key={slideItem._id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              opacity: idx === current ? 1 : 0,
              transform: idx === current ? 'scale(1)' : 'scale(1.05)',
              zIndex: idx === current ? 1 : 0,
            }}
          >
            {/* Background image */}
            <img
              src={slideItem.imageUrl}
              alt={slideItem.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay - fades image on the right/bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          </div>
        ))}

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end md:justify-center p-6 md:p-10 max-w-md">
          <div
            key={current}
            className="animate-slide-in"
          >
            <span className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">
              {item.category}
            </span>
            <h2 className="text-white text-2xl md:text-3xl font-black leading-tight mb-2">
              {item.name}
            </h2>
            {item.description && (
              <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-4">
              <span className="text-white text-xl font-black">Rs. {item.price}</span>

              {!item.isAvailable ? (
                <span className="text-white/50 text-sm font-bold">Unavailable</span>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAdd}
                  className="bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg"
                >
                  <Plus size={16} /> Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                  <button onClick={handleDec} className="p-1.5 text-white hover:bg-white/20 rounded-lg active:scale-90 transition-transform">
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-white text-sm w-8 text-center">{quantity}</span>
                  <button onClick={handleInc} className="p-1.5 text-white hover:bg-white/20 rounded-lg active:scale-90 transition-transform">
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {/* {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-colors hidden md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/50 transition-colors hidden md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )} */}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:left-10 md:translate-x-0">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx, idx > current ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current ? 'w-6 bg-primary' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

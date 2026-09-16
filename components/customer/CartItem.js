'use client';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function CartItem({ item }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 p-4 bg-white border-b border-gray-100 last:border-0 relative">
      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
      
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h4 className="font-bold text-base text-foreground">{item.name}</h4>
          <p className="text-primary font-bold text-sm mt-0.5">Rs. {item.price}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button 
              onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)} 
              className="p-1.5 hover:bg-white rounded-md text-text-muted active:scale-90 transition-transform"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)} 
              className="p-1.5 hover:bg-white rounded-md text-primary active:scale-90 transition-transform"
            >
              <Plus size={16} />
            </button>
          </div>
          <button 
            onClick={() => removeItem(item.id || item._id)}
            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg active:scale-90 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 text-right">
        <p className="font-bold text-foreground">Rs. {item.price * item.quantity}</p>
      </div>
    </div>
  );
}

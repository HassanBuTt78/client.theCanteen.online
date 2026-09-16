'use client';
import { Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function FoodCard({ item }) {
  const cartItems = useCartStore((state) => state.cartItems);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const itemId = item.id || item._id;
  const cartItem = cartItems.find((i) => i.id === itemId);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => addItem({ ...item, id: itemId });
  const handleInc = () => updateQuantity(itemId, quantity + 1);
  const handleDec = () => updateQuantity(itemId, quantity - 1);

  return (
    <div className={`relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${!item.isAvailable ? 'opacity-60' : ''}`}>
      <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
      
      {!item.isAvailable && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
          OUT OF STOCK
        </div>
      )}

      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-bold text-sm leading-tight text-foreground truncate">{item.name}</h4>
          <p className="text-primary font-bold text-sm mt-1">Rs. {item.price}</p>
        </div>

        <div className="mt-3">
          {!item.isAvailable ? (
            <button disabled className="w-full bg-gray-200 text-gray-500 py-1.5 rounded-lg text-sm font-bold">
              Unavailable
            </button>
          ) : quantity === 0 ? (
            <button 
              onClick={handleAdd}
              className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors py-1.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1 active:scale-95"
            >
              <Plus size={16} /> Add
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button onClick={handleDec} className="p-1 hover:bg-white rounded-md text-text-muted active:scale-90 transition-transform">
                <Minus size={16} />
              </button>
              <span className="font-bold text-sm w-6 text-center">{quantity}</span>
              <button onClick={handleInc} className="p-1 hover:bg-white rounded-md text-primary active:scale-90 transition-transform">
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

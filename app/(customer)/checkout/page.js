'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/cartStore';
import { pickupSlots } from '../../../data/pickupSlots';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      router.push('/cart');
    }
  }, [cartItems, router, loading]);

  const handlePlaceOrder = () => {
    if (!selectedSlot) return;
    setLoading(true);

    setTimeout(() => {
      const orderId = `ORD-${Date.now().toString().slice(-4)}`;
      clearCart();
      router.push(`/order-confirmation/${orderId}?time=${encodeURIComponent(selectedSlot.time)}`);
    }, 1000);
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black mb-6">Checkout</h1>

      {/* Section 1: Order Summary */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold mb-4">Order Summary</h2>
        <div className="space-y-3 mb-4 border-b border-gray-100 pb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-bold">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800">Total to Pay</span>
          <span className="font-black text-xl text-primary">Rs. {cartTotal}</span>
        </div>
      </section>

      {/* Section 2: Time Selection */}
      <section className="mb-6">
        <h2 className="font-bold mb-4">When do you want to pick up?</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {pickupSlots.map((slot) => (
            <button
              key={slot.id}
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot)}
              className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                !slot.available
                  ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                  : selectedSlot?.id === slot.id
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-primary/50'
              }`}
            >
              {slot.label}
              {!slot.available && <span className="block text-[10px] uppercase font-bold mt-0.5">Full</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Section 3: Payment Note */}
      <section className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm font-semibold mb-8 flex items-start gap-3">
        <span className="text-lg">💵</span>
        <p>Payment is cash on pickup at the counter. Please bring exact change if possible.</p>
      </section>

      <button
        disabled={!selectedSlot || loading}
        onClick={handlePlaceOrder}
        className="w-full bg-primary hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl transition-colors active:scale-[0.98] flex justify-center items-center h-[56px]"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Place Order'}
      </button>
    </div>
  );
}

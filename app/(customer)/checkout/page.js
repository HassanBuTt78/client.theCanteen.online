'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { getPickupSlots } from '../../../lib/api/pickupSlots';
import { placeOrder } from '../../../lib/api/orders';
import { Loader2, Banknote } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [slotError, setSlotError] = useState('');

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      router.push('/cart');
      return;
    }

    // Fetch pickup slots
    getPickupSlots()
      .then((data) => {
        setSlots(data.slots || []);
      })
      .catch((err) => {
        setSlotError(err.message || 'Failed to load pickup slots');
      })
      .finally(() => setPageLoading(false));
  }, [cartItems, router, loading]);

  const handlePlaceOrder = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    setError('');

    // Require auth for placing order
    if (!isAuthenticated) {
      // Save cart state and redirect to login with return URL
      router.push(`/login?redirect=/checkout`);
      setLoading(false);
      return;
    }

    try {
      const items = cartItems.map((item) => ({
        menuItemId: item._id,
        quantity: item.quantity,
      }));

      const order = await placeOrder(items, selectedSlot._id);
      clearCart();
      router.push(`/order-confirmation/${order.orderId}?time=${encodeURIComponent(selectedSlot.label || selectedSlot.time)}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (pageLoading || cartItems.length === 0) return null;

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black mb-6">Checkout</h1>

      {/* Section 1: Order Summary */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold mb-4">Order Summary</h2>
        <div className="space-y-3 mb-4 border-b border-gray-100 pb-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
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
        
        {slotError ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold text-center">
            {slotError}
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot) => (
              <button
                key={slot._id}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot)}
                className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                  !slot.available
                    ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedSlot?._id === slot._id
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-primary/50'
                }`}
              >
                {slot.label || slot.time}
                {!slot.available && <span className="block text-[10px] uppercase font-bold mt-0.5">Full</span>}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-text-muted text-sm">Loading available slots...</div>
        )}
      </section>

      {/* Section 3: Payment Note */}
      <section className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm font-semibold mb-4 flex items-start gap-3">
        <Banknote size={20} className="text-blue-500 shrink-0" />
        <p>Payment is cash on pickup at the counter. Please bring exact change if possible.</p>
      </section>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold text-center mb-4">
          {error}
        </div>
      )}

      <button
        disabled={!selectedSlot || loading}
        onClick={handlePlaceOrder}
        className="w-full bg-primary hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl transition-colors active:scale-[0.98] flex justify-center items-center h-[56px]"
      >
        {loading ? <Loader2 className="animate-spin" /> : isAuthenticated ? 'Place Order' : 'Sign In to Place Order'}
      </button>
    </div>
  );
}
'use client';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import CartItem from '../../../components/customer/CartItem';
import EmptyState from '../../../components/customer/EmptyState';
import { useCartStore } from '../../../store/cartStore';

export default function CartPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = useCartStore((state) => state.getCartTotal());

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        subtitle="Looks like you haven't added anything yet."
        actionLabel="Browse Menu"
        onAction={() => router.push('/menu')}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 pb-32 md:pb-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h1 className="text-2xl font-black mb-6">Your Cart</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {cartItems.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      <div className="md:w-80 h-fit bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-bold">Rs. {cartTotal}</span>
        </div>
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-text-muted">Tax / Delivery</span>
          <span className="font-bold">Rs. 0</span>
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
          <span className="font-bold text-base">Total</span>
          <span className="font-black text-xl text-primary">Rs. {cartTotal}</span>
        </div>

        <button
          onClick={() => router.push('/checkout')}
          className="w-full bg-primary hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          Proceed to Checkout
        </button>
        <button
          onClick={() => router.push('/menu')}
          className="w-full text-text-muted hover:text-foreground font-bold py-3 mt-2 text-sm transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

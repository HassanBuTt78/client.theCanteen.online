'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage(props) {
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  
  const [mounted, setMounted] = useState(false);
  const time = searchParams?.time || "ASAP";
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 animate-bounce-slow">
        <CheckCircle size={80} className="text-green-500" />
      </div>
      
      <h1 className="text-3xl font-black mb-2">Order Placed!</h1>
      <p className="text-text-muted mb-8">
        Your order <strong className="text-foreground">{params?.orderId}</strong> is confirmed.
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 w-full max-w-sm mb-8">
        <p className="text-sm font-semibold text-text-muted mb-1">Estimated Pickup Time</p>
        <p className="text-2xl font-black text-primary">{time}</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <Link 
          href="/my-orders"
          className="block w-full bg-primary text-white font-bold py-3.5 rounded-xl text-center active:scale-[0.98] transition-transform"
        >
          Track My Order
        </Link>
        <Link 
          href="/menu"
          className="block w-full bg-gray-100 text-foreground font-bold py-3.5 rounded-xl text-center active:scale-[0.98] transition-transform"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}

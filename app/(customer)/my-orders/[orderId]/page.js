'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, Clock } from 'lucide-react';
import { useAuthStore } from '../../../../store/authStore';
import { getOrderById } from '../../../../lib/api/orders';
import StatusBadge from '../../../../components/customer/StatusBadge';

export default function OrderDetailPage(props) {
  const params = use(props.params);
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    getOrderById(params.orderId)
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        setError(err.message || 'Order not found');
      })
      .finally(() => setLoading(false));
  }, [params.orderId, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-8 bg-gray-100 rounded-lg w-48 mx-auto" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-bold mb-2">Failed to load order</p>
        <p className="text-sm text-text-muted mb-4">{error}</p>
        <Link href="/my-orders" className="text-primary font-bold hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const stepperSteps = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed'];
  const currentIndex = stepperSteps.indexOf(order.status);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto">
      <Link href="/my-orders" className="inline-flex items-center text-text-muted hover:text-foreground font-semibold text-sm mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to My Orders
      </Link>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-black">{order.id || order._id}</h1>
            <p className="text-sm text-text-muted mt-1">{new Date(order.placedAt).toLocaleString()}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Stepper */}
        {order.status === 'Cancelled' ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl font-semibold text-sm text-center">
            This order was cancelled.
          </div>
        ) : (
          <div className="relative pt-4 pb-8">
            <div className="absolute top-6 left-4 right-4 h-1 bg-gray-100 -z-10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(Math.max(0, currentIndex) / (stepperSteps.length - 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between relative z-10">
              {stepperSteps.map((step, idx) => {
                const isActive = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-transparent'
                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                      <Check size={12} strokeWidth={4} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 px-1">
              <span className="text-[10px] font-bold text-gray-500 text-center w-8">Pen.</span>
              <span className="text-[10px] font-bold text-gray-500 text-center w-8">Conf.</span>
              <span className="text-[10px] font-bold text-gray-500 text-center w-8">Prep.</span>
              <span className="text-[10px] font-bold text-gray-500 text-center w-8">Ready</span>
              <span className="text-[10px] font-bold text-gray-500 text-center w-8">Done</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-center text-blue-800 font-semibold gap-3">
        <Clock className="text-blue-500" />
        <div>
          <p className="text-xs text-blue-600">Pickup Details</p>
          <p className="text-sm">Collect at counter by {order.pickupTime}</p>
        </div>
      </div>

      <h3 className="font-bold mb-3 text-lg">Order Details</h3>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="space-y-3 mb-4 border-b border-gray-100 pb-4">
          {order.items.map((item, idx) => (
            <div key={item.id || item._id || idx} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-bold">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800">Total</span>
          <span className="font-black text-xl text-primary">Rs. {order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}
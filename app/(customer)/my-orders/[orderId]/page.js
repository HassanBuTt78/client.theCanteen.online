'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, Clock } from 'lucide-react';
import { mockOrders } from '../../../../data/mockOrders';
import StatusBadge from '../../../../components/customer/StatusBadge';

export default function OrderDetailPage(props) {
  const params = use(props.params);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let found = mockOrders.find(o => o.id === params.orderId);
    
    // Fallback for dynamically placed mock orders
    if (!found && params.orderId.startsWith('ORD-')) {
      found = {
        id: params.orderId,
        items: [{ id: 'mock', name: 'Your Custom Order Items', quantity: 1, price: 0 }],
        totalAmount: '...',
        status: 'Pending',
        pickupTime: 'ASAP',
        placedAt: new Date().toISOString(),
      };
    }
    
    setOrder(found || null);
  }, [params.orderId]);

  if (!order) return <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>;

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
            <h1 className="text-xl font-black">{order.id}</h1>
            <p className="text-sm text-text-muted mt-1">{new Date(order.placedAt).toLocaleString()}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Stepper logic */}
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
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
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

'use client';
import Link from 'next/link';
import { ChevronRight, Calendar, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function OrderCard({ order }) {
  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to format date
  const formatTime = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    } catch(e) {
      return dateString;
    }
  };

  return (
    <Link href={`/my-orders/${order._id}`} className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-lg">{order._id}</h4>
          <div className="flex items-center text-xs text-text-muted mt-1 gap-3">
            <span className="flex items-center gap-1"><Calendar size={12}/> {formatTime(order.placedAt)}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> Pickup: {order.pickupTime}</span>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold">{itemCount} items</p>
          <p className="text-text-muted text-xs truncate max-w-[200px]">
            {order.items.map(i => i.name).join(', ')}
          </p>
        </div>
        <div className="text-right flex items-center gap-2">
          <p className="font-bold text-primary">Rs. {order.totalAmount}</p>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>
    </Link>
  );
}

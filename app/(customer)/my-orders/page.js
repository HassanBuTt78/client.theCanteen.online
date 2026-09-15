'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { getMyOrders } from '../../../lib/api/orders';
import OrderCard from '../../../components/customer/OrderCard';
import EmptyState from '../../../components/customer/EmptyState';
import { ClipboardList } from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeTab, setActiveTab] = useState('Active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup'];

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=/my-orders');
      return;
    }

    const status = activeTab === 'Active' ? 'active' : 'past';
    setLoading(true);
    setError('');

    getMyOrders(status)
      .then(setOrders)
      .catch((err) => {
        setError(err.message || 'Failed to load orders');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, activeTab, router]);

  // Don't render anything until auth check completes
  if (!isAuthenticated) return null;

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-black mb-6">My Orders</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        {['Active', 'Past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-white shadow-sm text-foreground'
                : 'text-text-muted hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-bold mb-2">Failed to load orders</p>
            <p className="text-sm text-text-muted">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Try again
            </button>
          </div>
        ) : orders.length > 0 ? (
          orders.map(order => (
            <OrderCard key={order.id || order._id} order={order} />
          ))
        ) : (
          <EmptyState 
            icon={ClipboardList}
            title={activeTab === 'Active' ? 'No active orders' : 'No past orders'}
            subtitle={activeTab === 'Active' ? "You haven't ordered anything recently." : "Your history is clean."}
            actionLabel={activeTab === 'Active' ? "Menu" : null}
            onAction={activeTab === 'Active' ? () => window.location.href='/menu' : null}
          />
        )}
      </div>
    </div>
  );
}
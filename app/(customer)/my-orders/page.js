'use client';
import { useState } from 'react';
import { mockOrders } from '../../../data/mockOrders';
import OrderCard from '../../../components/customer/OrderCard';
import EmptyState from '../../../components/customer/EmptyState';
import { ClipboardList } from 'lucide-react';

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' or 'Past'

  const activeStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup'];
  
  const activeOrders = mockOrders.filter(o => activeStatuses.includes(o.status));
  const pastOrders = mockOrders.filter(o => !activeStatuses.includes(o.status));

  const displayOrders = activeTab === 'Active' ? activeOrders : pastOrders;

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
        {displayOrders.length > 0 ? (
          displayOrders.map(order => (
            <OrderCard key={order.id} order={order} />
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

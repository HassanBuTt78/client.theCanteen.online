'use client';
import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Utensils, CheckCircle, CalendarDays } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import StatCard from '../../components/admin/StatCard';
import OrderRow from '../../components/admin/OrderRow';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

export default function LiveDashboardPage() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    orderId: null,
    newStatus: '',
    title: '',
    message: '',
    variant: 'primary'
  });

  // Filter state
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];

  useEffect(() => {
    setMounted(true);
    // Simulate initial data fetch
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Derived stats
  const todayOrders = orders.length; // Mocking all as today for demo
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready for Pickup').length;

  // Filtered and sorted orders
  const sortedOrders = [...orders].sort((a, b) => {
    // Sort by pickup time ascending (simple string compare works for mock format if 24h, but we'll just keep it simple)
    // Real app would parse date
    return new Date(a.placedAt) - new Date(b.placedAt);
  });
  
  const filteredOrders = activeFilter === 'All' 
    ? sortedOrders 
    : sortedOrders.filter(o => o.status === activeFilter);

  // Handlers
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleActionClick = (order, newStatus, title, variant = 'primary') => {
    setConfirmModalState({
      isOpen: true,
      orderId: order.id,
      newStatus,
      title,
      message: `Are you sure you want to change order ${order.id} status to ${newStatus}?`,
      variant
    });
  };

  const handleConfirmAction = () => {
    // Simulate async delay
    updateOrderStatus(confirmModalState.orderId, confirmModalState.newStatus);
    setConfirmModalState(prev => ({ ...prev, isOpen: false }));
    // Ideally add a toast here
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Today's Date Header */}
      <div className="flex items-center gap-3">
        <CalendarDays size={20} className="text-primary" />
        <p className="text-sm font-bold text-gray-500">
          Showing data for <span className="text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <SkeletonLoader type="stat" count={4} />
        ) : (
          <>
            <StatCard label="Today's Orders" value={todayOrders} icon={ShoppingBag} colorClass="bg-blue-100 text-blue-600" />
            <StatCard label="Pending" value={pendingCount} icon={Clock} colorClass="bg-gray-100 text-gray-600" />
            <StatCard label="Preparing" value={preparingCount} icon={Utensils} colorClass="bg-amber-100 text-amber-600" />
            <StatCard label="Ready for Pickup" value={readyCount} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
          </>
        )}
      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Filters */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2">
            {filters.map(filter => {
              const count = filter === 'All' ? orders.length : orders.filter(o => o.status === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeFilter === filter 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeFilter === filter ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <SkeletonLoader type="row" count={5} />
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="text-gray-300" size={32} />
              </div>
              <p className="text-lg font-bold text-gray-900">No orders found</p>
              <p className="text-gray-500 text-sm">There are no orders matching this status.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="py-4 px-6 font-semibold">Order ID</th>
                  <th className="py-4 px-6 font-semibold">Student</th>
                  <th className="py-4 px-6 font-semibold">Items</th>
                  <th className="py-4 px-6 font-semibold">Total</th>
                  <th className="py-4 px-6 font-semibold">Pickup Time</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map(order => (
                  <OrderRow 
                    key={order.id} 
                    order={order} 
                    onRowClick={handleRowClick}
                    onActionClick={handleActionClick}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <OrderDetailModal 
        isOpen={isDetailModalOpen} 
        order={selectedOrder} 
        onClose={() => setIsDetailModalOpen(false)} 
      />

      <ConfirmModal 
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        variant={confirmModalState.variant}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
      />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

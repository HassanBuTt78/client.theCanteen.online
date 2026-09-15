'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, ShoppingBag, TrendingUp, Target, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { adminGetSalesSummary, adminGetOrderHistory } from '../../../lib/api/admin';
import StatCard from '../../../components/admin/StatCard';
import SkeletonLoader from '../../../components/admin/SkeletonLoader';
import StatusBadge from '../../../components/customer/StatusBadge';

const ITEMS_PER_PAGE = 5;

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function SalesReportsPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [currentPage, setCurrentPage] = useState(1);
  
  const [summary, setSummary] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [summaryData, historyData] = await Promise.all([
        adminGetSalesSummary(selectedDate),
        adminGetOrderHistory({ date: selectedDate, page: currentPage, perPage: ITEMS_PER_PAGE }),
      ]);
      setSummary(summaryData);
      setOrderHistory(historyData.orders || []);
      setTotalOrders(historyData.pagination?.total || 0);
      setTotalPages(historyData.pagination?.totalPages || 1);
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    fetchReportData();
  }, [isAdmin, router, selectedDate, currentPage]);

  if (!isAdmin) return null;

  const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Date Picker */}
      <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm w-max">
        <CalendarDays size={20} className="text-primary shrink-0" />
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Report Date</p>
          <p className="text-sm font-bold text-gray-900">{displayDate}</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1);
          }}
          max={getTodayString()}
          className="ml-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <SkeletonLoader type="stat" count={4} />
        ) : summary ? (
          <>
            <StatCard 
              label="Total Revenue" 
              value={`Rs. ${(summary.totalRevenue || 0).toLocaleString()}`} 
              icon={DollarSign} 
              colorClass="bg-green-100 text-green-600" 
            />
            <StatCard 
              label="Total Orders" 
              value={summary.totalOrders || 0} 
              icon={ShoppingBag} 
              colorClass="bg-blue-100 text-blue-600" 
            />
            <StatCard 
              label="Avg. Order Value" 
              value={`Rs. ${summary.avgOrderValue || 0}`} 
              icon={TrendingUp} 
              colorClass="bg-purple-100 text-purple-600" 
            />
            <StatCard 
              label="Completion Rate" 
              value={summary.completionRate || '0%'} 
              icon={Target} 
              colorClass="bg-amber-100 text-amber-600" 
            />
          </>
        ) : (
          <SkeletonLoader type="stat" count={4} />
        )}
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <SkeletonLoader type="stat" count={2} />
        ) : summary ? (
          <>
            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="font-bold text-gray-900">Completed Orders</span>
              </div>
              <span className="text-3xl font-black text-green-600">{summary.ordersByStatus?.completed || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="font-bold text-gray-900">Cancelled Orders</span>
              </div>
              <span className="text-3xl font-black text-red-600">{summary.ordersByStatus?.cancelled || 0}</span>
            </div>
          </>
        ) : (
          <SkeletonLoader type="stat" count={2} />
        )}
      </div>

      {/* Paginated Order History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Order History</h2>
          <span className="text-sm text-gray-500 font-medium">{totalOrders} total orders</span>
        </div>
        
        {loading ? (
          <SkeletonLoader type="row" count={5} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Items</th>
                    <th className="py-4 px-6 text-right">Total</th>
                    <th className="py-4 px-6">Pickup Time</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Placed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orderHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">No orders found for this date.</td>
                    </tr>
                  ) : (
                    orderHistory.map(order => (
                      <tr key={order.id || order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-mono text-sm font-semibold">{order.id || order._id}</td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-sm text-gray-900">{order.studentName}</p>
                          <p className="text-xs text-gray-500">{order.rollNumber}</p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-right">Rs. {order.totalAmount}</td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-700">{order.pickupTime}</td>
                        <td className="py-4 px-6"><StatusBadge status={order.status} /></td>
                        <td className="py-4 px-6 text-xs text-gray-500">
                          {order.placedAt ? new Date(order.placedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <p className="text-sm text-gray-500 font-medium">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalOrders)} of {totalOrders}
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                        currentPage === page 
                          ? 'bg-gray-900 text-white' 
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
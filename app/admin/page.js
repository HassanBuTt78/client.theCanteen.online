"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Clock, Utensils, CheckCircle, CalendarDays, Radio } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";
import { useAuthStore } from "../../store/authStore";
import StatCard from "../../components/admin/StatCard";
import OrderRow from "../../components/admin/OrderRow";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import ConfirmModal from "../../components/admin/ConfirmModal";
import SkeletonLoader from "../../components/admin/SkeletonLoader";

const POLL_INTERVAL = 10_000; // 10 seconds

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function LiveDashboardPage() {
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const {
    orders,
    loading,
    newOrderIds,
    updatedOrderIds,
    fetchLiveOrders,
    pollLiveOrders,
    updateOrderStatus,
  } = useAdminStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [lastPolled, setLastPolled] = useState(null);
  const pollRef = useRef(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    orderId: null,
    newStatus: "",
    title: "",
    message: "",
    variant: "primary",
  });

  // Filter state
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Pending", "Confirmed", "Preparing", "Ready for Pickup", "Completed", "Cancelled"];

  const todayDate = getTodayString();

  // Initial fetch
  useEffect(() => {
    if (isAdmin === null) return;
    if (!isAdmin) {
      router.push("/admin/login");
      return;
    }

    let cancelled = false;
    fetchLiveOrders(todayDate)
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setInitialLoading(false);
          setLastPolled(new Date());
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin, router, fetchLiveOrders, todayDate]);

  // Polling every 10 seconds
  useEffect(() => {
    if (!isAdmin || initialLoading) return;

    pollRef.current = setInterval(() => {
      pollLiveOrders(todayDate).then(() => {
        setLastPolled(new Date());
      });
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isAdmin, initialLoading, pollLiveOrders, todayDate]);

  // Derived stats
  const todayOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const preparingCount = orders.filter((o) => o.status === "Preparing").length;
  const readyCount = orders.filter((o) => o.status === "Ready for Pickup").length;

  // Filtered and sorted orders — newest first for live dashboard
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.placedAt) - new Date(a.placedAt);
  });

  const filteredOrders =
    activeFilter === "All" ? sortedOrders : sortedOrders.filter((o) => o.status === activeFilter);

  // Handlers
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleActionClick = (order, newStatus, title, variant = "primary") => {
    setConfirmModalState({
      isOpen: true,
      orderId: order._id,
      newStatus,
      title,
      message: `Are you sure you want to change order ${order.orderId} status to ${newStatus}?`,
      variant,
    });
  };

  const handleConfirmAction = async () => {
    try {
      await updateOrderStatus(confirmModalState.orderId, confirmModalState.newStatus);
      // Re-poll immediately after a status change
      pollLiveOrders(todayDate).then(() => setLastPolled(new Date()));
    } catch (err) {
      // Could show a toast here
    }
    setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Today's Date Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays size={20} className="text-primary" />
          <p className="text-sm font-bold text-gray-500">
            Showing data for{" "}
            <span className="text-gray-900">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold text-green-700">Live</span>
          {lastPolled && (
            <span className="text-xs text-green-600/70 font-medium">
              · {lastPolled.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {initialLoading || loading ? (
          <SkeletonLoader type="stat" count={4} />
        ) : (
          <>
            <StatCard
              label="Today's Orders"
              value={todayOrders}
              icon={ShoppingBag}
              colorClass="bg-blue-100 text-blue-600"
            />
            <StatCard
              label="Pending"
              value={pendingCount}
              icon={Clock}
              colorClass="bg-gray-100 text-gray-600"
            />
            <StatCard
              label="Preparing"
              value={preparingCount}
              icon={Utensils}
              colorClass="bg-amber-100 text-amber-600"
            />
            <StatCard
              label="Ready for Pickup"
              value={readyCount}
              icon={CheckCircle}
              colorClass="bg-green-100 text-green-600"
            />
          </>
        )}
      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2">
            {filters.map((filter) => {
              const count =
                filter === "All" ? orders.length : orders.filter((o) => o.status === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeFilter === filter
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === filter ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {initialLoading || loading ? (
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
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    onRowClick={handleRowClick}
                    onActionClick={handleActionClick}
                    isNew={newOrderIds.has(order._id)}
                    isUpdated={updatedOrderIds.has(order._id)}
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
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes flash-new {
          0% { background-color: rgb(220 252 231); }
          100% { background-color: transparent; }
        }
        @keyframes flash-updated {
          0% { background-color: rgb(254 249 195); }
          100% { background-color: transparent; }
        }
        .row-flash-new {
          animation: flash-new 3s ease-out forwards;
        }
        .row-flash-updated {
          animation: flash-updated 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

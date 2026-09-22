import { create } from 'zustand';
import {
  adminGetMenuItems,
  adminCreateMenuItem,
  adminUpdateMenuItem,
  adminDeleteMenuItem,
  adminToggleAvailability,
  adminGetOrders,
  adminGetLiveOrders,
  adminUpdateOrderStatus,
} from '../lib/api/admin';

/**
 * Admin store — fetches data from API and provides local mutations.
 * Actions are async, calling the API then updating local state.
 */
export const useAdminStore = create((set, get) => ({
  orders: [],
  menuItems: [],
  loading: false,
  // Track IDs that are "new" or "updated" for live flash effect
  newOrderIds: new Set(),
  updatedOrderIds: new Set(),

  /** Fetch orders from API (paginated, for reports etc.) */
  fetchOrders: async (query = {}) => {
    set({ loading: true });
    try {
      const data = await adminGetOrders(query);
      set({ orders: data.orders, loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  /** Fetch live orders — initial load with loading state */
  fetchLiveOrders: async (date) => {
    set({ loading: true });
    try {
      const orders = await adminGetLiveOrders(date);
      set({ orders, loading: false, newOrderIds: new Set(), updatedOrderIds: new Set() });
      return orders;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  /** Silent poll — no loading spinner, detects new & changed orders */
  pollLiveOrders: async (date) => {
    try {
      const freshOrders = await adminGetLiveOrders(date);
      const prev = get().orders;
      const prevMap = new Map(prev.map((o) => [o._id, o]));

      const newIds = new Set();
      const updatedIds = new Set();

      for (const order of freshOrders) {
        const existing = prevMap.get(order._id);
        if (!existing) {
          newIds.add(order._id);
        } else if (existing.status !== order.status) {
          updatedIds.add(order._id);
        }
      }

      set({ orders: freshOrders, newOrderIds: newIds, updatedOrderIds: updatedIds });

      // Clear highlights after 3 seconds
      if (newIds.size > 0 || updatedIds.size > 0) {
        setTimeout(() => {
          set({ newOrderIds: new Set(), updatedOrderIds: new Set() });
        }, 3000);
      }

      return freshOrders;
    } catch {
      // Silent fail on poll
      return get().orders;
    }
  },

  /** Update order status via API */
  updateOrderStatus: async (orderId, newStatus) => {
    await adminUpdateOrderStatus(orderId, newStatus);
    // Update local state optimistically
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ),
    }));
  },

  /** Fetch menu items from API */
  fetchMenuItems: async () => {
    set({ loading: true });
    try {
      const items = await adminGetMenuItems();
      set({ menuItems: items, loading: false });
      return items;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  /** Create menu item via API */
  addMenuItem: async (data) => {
    const item = await adminCreateMenuItem(data);
    set((state) => ({
      menuItems: [...state.menuItems, item],
    }));
    return item;
  },

  /** Update menu item via API */
  updateMenuItem: async (id, data) => {
    const updated = await adminUpdateMenuItem(id, data);
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item._id === id ? updated : item
      ),
    }));
    return updated;
  },

  /** Delete menu item via API */
  deleteMenuItem: async (id) => {
    await adminDeleteMenuItem(id);
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item._id !== id),
    }));
  },

  /** Toggle availability via API */
  toggleItemAvailability: async (id) => {
    // Find current state to toggle
    const item = get().menuItems.find((i) => i._id === id);
    if (!item) return;
    const updated = await adminToggleAvailability(id, !item.isAvailable);
    set((state) => ({
      menuItems: state.menuItems.map((i) =>
        i._id === id ? updated : i
      ),
    }));
    return updated;
  },
}));
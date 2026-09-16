import { create } from 'zustand';
import {
  adminGetMenuItems,
  adminCreateMenuItem,
  adminUpdateMenuItem,
  adminDeleteMenuItem,
  adminToggleAvailability,
  adminGetOrders,
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

  /** Fetch orders from API */
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
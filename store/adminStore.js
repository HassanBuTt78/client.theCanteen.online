import { create } from 'zustand';
import { adminOrders } from '../data/admin/adminOrders';
import { adminMenuItems } from '../data/admin/adminMenuItems';

export const useAdminStore = create((set) => ({
  orders: adminOrders,
  menuItems: adminMenuItems,

  // Order actions
  updateOrderStatus: (orderId, newStatus) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
  })),

  // Menu actions
  addMenuItem: (item) => set((state) => ({
    menuItems: [...state.menuItems, { ...item, id: `ITEM-${Date.now()}` }]
  })),

  updateMenuItem: (id, updates) => set((state) => ({
    menuItems: state.menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  deleteMenuItem: (id) => set((state) => ({
    menuItems: state.menuItems.filter(item => item.id !== id)
  })),

  toggleItemAvailability: (id) => set((state) => ({
    menuItems: state.menuItems.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    )
  }))
}));

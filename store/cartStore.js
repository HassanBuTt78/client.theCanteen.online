import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  addItem: (item) => set((state) => {
    const existing = state.cartItems.find(i => i.id === item.id);
    if (existing) {
      if (existing.quantity >= 10) return state; // Max 10 items
      return {
        cartItems: state.cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      };
    }
    return {
      cartItems: [...state.cartItems, { ...item, quantity: 1 }]
    };
  }),
  removeItem: (id) => set((state) => ({
    cartItems: state.cartItems.filter(i => i.id !== id)
  })),
  updateQuantity: (id, qty) => set((state) => {
    if (qty < 1) {
      return { cartItems: state.cartItems.filter(i => i.id !== id) };
    }
    if (qty > 10) return state;
    return {
      cartItems: state.cartItems.map(i => i.id === id ? { ...i, quantity: qty } : i)
    };
  }),
  clearCart: () => set({ cartItems: [] }),
  getCartTotal: () => {
    return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  getCartCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}));

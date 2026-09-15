import { create } from 'zustand';
import api, { setTokenProvider, ApiError } from '../lib/apiClient';

/**
 * Auth store managing customer and admin authentication.
 * 
 * Persists token to localStorage and restores on init.
 * Listens for 'auth:unauthorized' events to auto-logout.
 */

const TOKEN_KEY = 'canteen_token';
const USER_KEY = 'canteen_user';
const ADMIN_KEY = 'canteen_admin';

function loadFromStorage(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export const useAuthStore = create((set, get) => {
  // Restore persisted state
  const initialToken = loadFromStorage(TOKEN_KEY);
  const initialUser = loadFromStorage(USER_KEY);
  const initialAdmin = loadFromStorage(ADMIN_KEY);

  // Register token provider with apiClient
  if (initialToken) {
    setTokenProvider(() => get().token);
  }

  // Auto-logout on 401
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:unauthorized', () => {
      get().logout();
    });
  }

  return {
    token: initialToken,
    user: initialUser,
    admin: initialAdmin,
    isAuthenticated: !!initialToken,
    isAdmin: !!initialAdmin,

    /** Customer login */
    login: async (phone, password) => {
      const res = await api.post('/auth/login', {
        body: { phone, password },
      });

      const { token, user } = res.data;

      set({
        token,
        user,
        admin: null,
        isAuthenticated: true,
        isAdmin: false,
      });

      saveToStorage(TOKEN_KEY, token);
      saveToStorage(USER_KEY, user);
      saveToStorage(ADMIN_KEY, null);

      // Ensure token provider is set
      setTokenProvider(() => get().token);

      return { token, user };
    },

    /** Customer register */
    register: async (name, phone, password) => {
      const res = await api.post('/auth/register', {
        body: { name, phone, password },
      });

      return res.data; // { user }
    },

    /** Admin login */
    adminLogin: async (identifier, password) => {
      const res = await api.post('/auth/admin/login', {
        body: { identifier, password },
      });

      const { token, admin } = res.data;

      set({
        token,
        admin,
        user: null,
        isAuthenticated: true,
        isAdmin: true,
      });

      saveToStorage(TOKEN_KEY, token);
      saveToStorage(ADMIN_KEY, admin);
      saveToStorage(USER_KEY, null);

      // Ensure token provider is set
      setTokenProvider(() => get().token);

      return { token, admin };
    },

    /** Universal logout */
    logout: () => {
      set({
        token: null,
        user: null,
        admin: null,
        isAuthenticated: false,
        isAdmin: false,
      });

      saveToStorage(TOKEN_KEY, null);
      saveToStorage(USER_KEY, null);
      saveToStorage(ADMIN_KEY, null);
    },
  };
});
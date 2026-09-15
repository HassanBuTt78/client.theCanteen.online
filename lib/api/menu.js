import api from '../apiClient';

/**
 * Menu item API — all public endpoints
 */

/**
 * Fetch menu items with optional filters.
 * @param {Object} filters
 * @param {string} [filters.category] - Snacks, Drinks, Meals, Desserts
 * @param {string} [filters.search] - Name regex search
 * @param {boolean|string} [filters.available] - "true" or "false"
 * @returns {Promise<Array>} Array of menu items
 */
export async function getMenuItems(filters = {}) {
  const query = {};
  if (filters.category && filters.category !== 'All') {
    query.category = filters.category;
  }
  if (filters.search) {
    query.search = filters.search;
  }
  if (filters.available !== undefined && filters.available !== null) {
    query.available = String(filters.available);
  }

  const res = await api.get('/menu-items', { query });
  return res.data.items;
}

/**
 * Fetch a single menu item by ID.
 * @param {string} id
 * @returns {Promise<Object>} Menu item
 */
export async function getMenuItemById(id) {
  const res = await api.get(`/menu-items/${id}`);
  return res.data.item;
}
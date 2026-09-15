import api from '../apiClient';

/**
 * Orders API — requires customer authentication
 */

/**
 * Place a new order.
 * @param {Array<{ menuItemId: string, quantity: number }>} items
 * @param {string} pickupSlotId
 * @returns {Promise<Object>} The created order
 */
export async function placeOrder(items, pickupSlotId) {
  const res = await api.post('/orders', {
    body: { items, pickupSlotId },
  });
  return res.data.order;
}

/**
 * Get the current user's orders.
 * @param {'active'|'past'|undefined} status
 * @returns {Promise<Array>} Array of orders
 */
export async function getMyOrders(status) {
  const query = {};
  if (status) query.status = status;
  const res = await api.get('/orders', { query });
  return res.data.orders;
}

/**
 * Get a single order by ID.
 * @param {string} id
 * @returns {Promise<Object>} The order
 */
export async function getOrderById(id) {
  const res = await api.get(`/orders/${id}`);
  return res.data.order;
}
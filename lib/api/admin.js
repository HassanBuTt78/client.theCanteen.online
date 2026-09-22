import api from '../apiClient';

/**
 * Admin API — requires admin authentication
 */

// ─── Menu Management ───────────────────────────────────────

export async function adminGetMenuItems() {
  const res = await api.get('/admin/menu-items');
  return res.data.items;
}

export async function adminCreateMenuItem(data) {
  const res = await api.post('/admin/menu-items', { body: data });
  return res.data.item;
}

export async function adminUpdateMenuItem(id, data) {
  const res = await api.put(`/admin/menu-items/${id}`, { body: data });
  return res.data.item;
}

export async function adminDeleteMenuItem(id) {
  await api.delete(`/admin/menu-items/${id}`);
}

export async function adminToggleAvailability(id, isAvailable) {
  const res = await api.patch(`/admin/menu-items/${id}/availability`, {
    body: { isAvailable },
  });
  return res.data.item;
}

// ─── Order Management ──────────────────────────────────────

export async function adminGetOrders(query = {}) {
  const params = {};
  if (query.status) params.status = query.status;
  if (query.date) params.date = query.date;
  if (query.page) params.page = query.page;
  if (query.perPage) params.perPage = query.perPage;

  const res = await api.get('/admin/orders', { query: params });
  return res.data; // { orders, pagination }
}

export async function adminGetLiveOrders(date) {
  const query = {};
  if (date) query.date = date;
  const res = await api.get('/admin/orders/live', { query });
  return res.data.orders; // flat array, no pagination
}

export async function adminUpdateOrderStatus(orderId, status) {
  const res = await api.patch(`/admin/orders/${orderId}/status`, {
    body: { status },
  });
  return res.data.order;
}

// ─── Pickup Slots ──────────────────────────────────────────

export async function adminGetPickupSlots() {
  const res = await api.get('/admin/pickup-slots');
  return res.data; // { date, slots }
}

// ─── Reports ───────────────────────────────────────────────

export async function adminGetSalesSummary(date) {
  const query = {};
  if (date) query.date = date;
  const res = await api.get('/admin/reports', { query });
  return res.data; // { date, totalRevenue, totalOrders, ... }
}

export async function adminGetOrderHistory(query = {}) {
  const params = {};
  if (query.date) params.date = query.date;
  if (query.page) params.page = query.page;
  if (query.perPage) params.perPage = query.perPage;
  if (query.sort) params.sort = query.sort;

  const res = await api.get('/admin/reports/orders', { query: params });
  return res.data; // { orders, pagination }
}
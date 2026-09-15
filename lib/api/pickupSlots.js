import api from '../apiClient';

/**
 * Pickup slots API — public
 */

/**
 * Get available pickup slots for today.
 * @returns {Promise<{ date: string, slots: Array }>}
 */
export async function getPickupSlots() {
  const res = await api.get('/pickup-slots');
  return res.data; // { date, slots }
}
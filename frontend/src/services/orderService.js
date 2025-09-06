// src/services/orderService.js
import API from '../api';

// ✅ Fetch a single order by ID
export const fetchOrderById = async (id) => {
  try {
    const res = await API.get(`/orders/${id}`);
    return res.data;
  } catch (err) {
    console.error('[fetchOrderById] ❌', err);
    return { error: 'Failed to fetch order' };
  }
};

// ✅ Cancel an order by ID
export const cancelOrder = async (id) => {
  try {
    const res = await API.patch(`/orders/${id}/cancel`);
    return res.data;
  } catch (err) {
    console.error('[cancelOrder] ❌', err);
    return { error: 'Failed to cancel order' };
  }
};

// ✅ Get all orders of logged-in user
export const getUserOrders = async () => {
  try {
    const res = await API.get('/orders/my-orders');
    return res.data;
  } catch (err) {
    console.error('[getUserOrders] ❌', err);
    return { error: 'Failed to fetch user orders' };
  }
};

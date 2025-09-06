// src/services/cartService.js
import API from '../api';

// Helper to handle API errors consistently
const handleError = (err, action) => {
  if (err.response) {
    // Server responded but with error code
    console.error(`[${action}] ❌`, err.response.data?.message || err.response.statusText);

    if (err.response.status === 401) {
      // Not logged in → session expired
      return { error: 'Unauthorized. Please log in again.', unauthorized: true };
    }

    return { error: err.response.data?.message || 'Server error' };
  } else {
    // No response (network / CORS issue)
    console.error(`[${action}] ❌ Network/No response`, err.message);
    return { error: 'Network error. Please try again.' };
  }
};

// 🚚 GET cart items
export const getCart = async () => {
  try {
    const res = await API.get('/api/cart');
    return res.data; // { items: [...] }
  } catch (err) {
    return handleError(err, 'getCart');
  }
};

// 🔁 POST/UPDATE cart item
export const updateCart = async (productId, quantity) => {
  if (!productId) return { error: 'Missing productId' };

  try {
    const res = await API.post('/api/cart', { productId, quantity });
    return res.data; // { items: [...] }
  } catch (err) {
    return handleError(err, 'updateCart');
  }
};

// ❌ DELETE cart item
export const removeFromCart = async (productId) => {
  if (!productId) return { error: 'Missing productId' };

  try {
    const res = await API.delete(`/api/cart/${productId}`);
    return res.data; // { items: [...] }
  } catch (err) {
    return handleError(err, 'removeFromCart');
  }
};

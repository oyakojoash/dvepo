import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { placeOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.price ?? 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    const products = cartItems.map(item => ({
      productId: item._id || item.id,
      quantity: item.quantity,
    }));

    try {
      setLoading(true);
      await placeOrder({ products, totalAmount });
      clearCart();
      navigate('/account/orders');
    } catch (err) {
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <ul className="checkout-items">
        {cartItems.map(item => (
          <li key={item._id || item.id}>
            {item.name} x{item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <h3>Total: ${totalAmount.toFixed(2)}</h3>

      <button onClick={handlePlaceOrder} disabled={loading || cartItems.length === 0}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}

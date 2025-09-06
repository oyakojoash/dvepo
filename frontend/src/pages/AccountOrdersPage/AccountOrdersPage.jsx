import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../../services/orderService';
import { Link } from 'react-router-dom'; // FIX: Import Link
import './AccountOrdersPage.css';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getUserOrders(); // FIX: use correct function
        setOrders(data);
      } catch (err) {
        alert('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p className="orders-loading">Loading your orders...</p>;
  if (orders.length === 0) return <p className="orders-empty">You have no past orders.</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Status:</strong> {order.status}</span>
              <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <ul className="order-items">
              {order.products.map((p, idx) => (
                <li key={idx}>
                  {p.productId?.name ?? 'Product'} x {p.quantity} — ${p.productId?.price?.toFixed(2) ?? 'N/A'}
                </li>
              ))}
            </ul>

            <Link to={`/account/orders/${order._id}`} className="view-details-link">
              View Details
            </Link>

            <div className="order-total">
              <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

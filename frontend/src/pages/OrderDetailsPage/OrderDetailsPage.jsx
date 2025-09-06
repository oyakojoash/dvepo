import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, cancelOrder } from '../../services/orderService';
import './OrderDetailsPage.css';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (err) {
        alert('Failed to load order.');
        navigate('/account/orders');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const updated = await cancelOrder(orderId);
      setOrder(updated.order);
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="order-details-page">
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <ul className="order-products">
        {order.products.map((p, i) => (
          <li key={i}>
            <div>{p.productId?.name ?? 'Unknown Product'}</div>
            <div>Qty: {p.quantity}</div>
            <div>Price: ${p.productId?.price?.toFixed(2)}</div>
            <div>Subtotal: ${(p.quantity * (p.productId?.price ?? 0)).toFixed(2)}</div>
          </li>
        ))}
      </ul>

      <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>

      {order.status === 'Processing' && (
        <button className="cancel-order-btn" onClick={handleCancel}>
          Cancel Order
        </button>
      )}
    </div>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';
import { vendors } from '../../data/vendors';
import { CartContext } from '../../context/CartContext';
import API from '../../api'; // ✅ Import the centralized API base URL

export default function ProductDetails() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`, {
      credentials: 'include', // ✅ Optional: only needed if auth required
    })
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Error loading product:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found.</p>;

  const vendor = vendors.find(v => v.id === product.vendorId);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-details-page">
      <img
        src={product.image}
        alt={product.name}
        className="product-details-image"
      />
      <div className="product-details-info">
        <h2>{product.name}</h2>
        <p className="product-details-price">
          ${Number(product.price).toFixed(2)}
        </p>

        {vendor && (
          <div className="vendor-info">
            <img src={vendor.logo} alt={vendor.name} className="vendor-logo" />
            <span>Sold by: {vendor.name}</span>
          </div>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

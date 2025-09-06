import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../../components/product/product';
import './VendorPage.css';
import API from '../../api'; // ✅ Use centralized base URL

export default function VendorPage() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchVendor() {
      try {
        const res = await fetch(`${API}/api/vendors/${vendorId}`);
        if (!res.ok) throw new Error('Vendor not found');
        const data = await res.json();
        setVendor(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchVendor();
  }, [vendorId]);

  useEffect(() => {
    async function fetchVendorProducts() {
      try {
        const res = await fetch(`${API}/api/vendors/${vendorId}/products`);
        if (!res.ok) throw new Error('Could not load vendor products');
        const data = await res.json();
        setVendorProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVendorProducts();
  }, [vendorId]);

  if (loading) return <div>Loading vendor...</div>;
  if (error || !vendor) return <div>{error || 'Vendor not found'}</div>;

  return (
    <div>
      <div className="vendor-header">
        <img
          src={`${API}/images/vendors/${vendor.logo}`}
          alt={vendor.name}
          className="vendor-banner-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${API}/images/fallback-logo.png`;
          }}
        />
        <h2>{vendor.name}</h2>
        <p>{vendor.description}</p>
      </div>

      <div className="product-list">
        {vendorProducts.length === 0 ? (
          <p>No products available for this vendor.</p>
        ) : (
          vendorProducts.map(product => (
            <Product
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              vendorId={product.vendorId}
            />
          ))
        )}
      </div>
    </div>
  );
}

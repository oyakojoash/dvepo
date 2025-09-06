import React, { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar';
import ProductsPage from './pages/Productpage/ProductsPage';
import CartPage from './pages/Cartpage/CartPage';
import Login from './pages/login/Login';
import Account from './pages/account/Account';
import ForgotPassword from './pages/login/ForgotPassword';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import VendorPage from './pages/VendorPage/VendorPage';
import AccountOrdersPage from './pages/AccountOrdersPage/AccountOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage/OrderDetailsPage';

import { useContext } from 'react';
import { CartContext } from './context/CartContext';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems } = useContext(CartContext); // ✅ Get from context

  return (
    <>
      <Navbar
        cartItemCount={cartItems.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Routes>
        <Route
          path="/"
          element={<ProductsPage searchTerm={searchTerm} />}
        />
        <Route
          path="/products"
          element={<ProductsPage searchTerm={searchTerm} />}
        />
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />
        <Route
          path="/cart"
          element={<CartPage />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/vendor/:vendorId" element={<VendorPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/account/orders" element={<AccountOrdersPage />} />
        <Route path="/account/orders/:orderId" element={<OrderDetailsPage />} />
      </Routes>
    </>
  );
}

export default App;

// src/components/ProtectedRoute/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../../api';

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    API.get('/api/auth/me', { withCredentials: true })
      .then((res) => {
        console.log("✅ Auth success:", res.data);
        setAuth(true);
      })
      .catch((err) => {
        console.warn("❌ Auth failed:", err.response?.data || err.message);
        setAuth(false);
      });
  }, []);

  if (auth === null) return <div>Checking authentication...</div>;
  return auth ? children : <Navigate to="/login" />;
}

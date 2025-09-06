// src/components/ProtectedRoute/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../../api';

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    let isMounted = true;
    API.get('/api/auth/me')
      .then((res) => {
        console.log("✅ Auth success:", res.data);
        console.log(auth);
        if (isMounted) setAuth(true);
      })
      .catch((err) => {
        console.warn("❌ Auth failed:", err.response?.data || err.message);
        if (isMounted) setAuth(false);
      });
    return () => { isMounted = false; };
  }, []);

  if (auth === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return auth ? children : <Navigate to="/login" replace />;
}

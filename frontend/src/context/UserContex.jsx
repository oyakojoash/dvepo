// src/context/UserProvider.jsx
import { createContext, useEffect, useState } from 'react';
import API from '../api';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/auth/me', { withCredentials: true })
      .then((res) => {
        console.log("👤 UserContext loaded:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.warn("❌ Failed to load user:", err.response?.data || err.message);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

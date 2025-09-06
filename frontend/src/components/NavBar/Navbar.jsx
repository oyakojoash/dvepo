import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import SearchBar from '../search/SearchBar';
import { CartContext } from '../../context/CartContext';

export default function Navbar({ searchTerm, setSearchTerm }) {
  const { cartItems } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/auth/me', {
      credentials: 'true',
         });

        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    navigate('/login');
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo-link">🛍️ MyShop</Link>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/products">Products</Link></li>

        <li
          className="cart-link"
          onMouseEnter={() => setShowCartDropdown(true)}
          onMouseLeave={() => setShowCartDropdown(false)}
        >
          <Link to="/cart">
            🛒 Cart ({totalQuantity})
          </Link>

          {showCartDropdown && cartItems.length > 0 && (
            <div className="cart-dropdown">
              {cartItems.slice(0, 3).map(item => (
                <div key={item.id || item._id} className="cart-item-preview">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                  <span>${(item.price ?? 0).toFixed(2)}</span>
                </div>
              ))}
              <Link to="/cart" className="view-cart-btn">View Full Cart</Link>
            </div>
          )}
        </li>

        {user ? (
          <>
            <li className="user-info">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="user-avatar"
                />
              ) : (
                <span>Hi, {user.fullName?.split(' ')[0]}</span>
              )}
            </li>
            <li><Link to="/account">Account</Link></li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}

        <li>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </li>
      </ul>
    </nav>
  );
}

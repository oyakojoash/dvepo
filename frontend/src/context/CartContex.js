import React, { createContext, useState, useEffect } from 'react';
import {
  getCart,
  updateCart,
  removeFromCart,
} from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCartItems(data.items || []);
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    };

    fetchCart();
  }, []);

  // Update quantity in cart (and backend)
  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) return;

      await updateCart(productId, newQuantity);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId || item._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  // Remove item from cart (and backend)
  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId && item._id !== productId)
      );
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };
  const addToCart = async (product) => {
  try {
    await updateCart(product._id || product.id, 1);

    const existing = cartItems.find(
      (item) => item._id === product._id || item.id === product.id
    );

    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === product._id || item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        { ...product, quantity: 1 },
      ]);
    }
  } catch (err) {
    console.error('Failed to add to cart:', err);
  }
};


  return (
    <CartContext.Provider
  value={{
    cartItems,
    setCartItems,
    updateQuantity,
    removeItem,
    addToCart, // 👈 Add this
  }}
>

      {children}
    </CartContext.Provider>
  );
};

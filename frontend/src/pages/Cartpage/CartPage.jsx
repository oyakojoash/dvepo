import React, { useContext } from 'react';
import Cart from '../../components/cart/Cart';
import './CartPage.css';
import { CartContext } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useContext(CartContext);

  return (
    <div className="cart-page">
      <Cart
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
}

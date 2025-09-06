import React from 'react';
import './Cart.css';

export default function Cart({ cartItems, updateQuantity, removeItem }) {
  // Safely compute total even if item.price is undefined
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price ?? 0) * item.quantity,
      0
    );
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div>
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">
                    ${ (item.price ?? 0).toFixed(2) }
                  </p>
                </div>
              </div>

              <div className="cart-item-actions">
                <button
                  className="reduce-button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  reduce
                </button>

                <span>{item.quantity}</span>

                <button
                  className="add-button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  add
                </button>

                <button
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                >
                  remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
         const getTotal= 

    
          </div>
        </div>
      )}
    </div>
  );
}

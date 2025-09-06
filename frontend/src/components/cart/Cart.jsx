import React from "react";
import PropTypes from "prop-types";
import "./Cart.css";
import API from "../../api"; // ✅ Use central API path

/* --- Utility Helpers --- */
function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatPrice(value) {
  return safeNumber(value).toFixed(2);
}

/* --- Cart Component --- */
export default function Cart({ cartItems, updateQuantity, removeItem }) {
  const getTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = safeNumber(item?.productId?.price);
      const qty = safeNumber(item?.quantity, 1);
      return sum + price * qty;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => {
            const product = item.productId;
            if (!product) return null;

            return (
              <div key={product._id} className="cart-item">
                <div className="cart-item-info">
                  <img
                    src={`${API}/images/${product.image}`}
                    alt={product.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${API}/images/fallback-product.jpeg`;
                    }}
                  />
                  <div>
                    <h4 className="cart-item-name">{product.name}</h4>
                    <p className="cart-item-price">${formatPrice(product.price)}</p>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <button
                    className="reduce-button"
                    onClick={() =>
                      updateQuantity(product._id, safeNumber(item.quantity, 1) - 1)
                    }
                    disabled={safeNumber(item.quantity, 1) <= 1}
                  >
                    reduce
                  </button>

                  <span>{safeNumber(item.quantity, 1)}</span>

                  <button
                    className="add-button"
                    onClick={() =>
                      updateQuantity(product._id, safeNumber(item.quantity, 1) + 1)
                    }
                  >
                    add
                  </button>

                  <button
                    className="remove-button"
                    onClick={() => removeItem(product._id)}
                  >
                    remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cart-total">Total: ${getTotal()}</div>
        </div>
      )}
    </div>
  );
}

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        image: PropTypes.string,
      }),
      quantity: PropTypes.number,
    })
  ).isRequired,
  updateQuantity: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartScreen.css";

const CartScreen = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id, name) => {
    if (window.confirm(`Remove ${name} from cart?`)) {
      removeFromCart(id);

      const item = document.getElementById(`cart-item-${id}`);
      if (item) {
        item.style.transform = 'translateX(-100%)';
        item.style.opacity = '0';
      }
    }
  };

  const handleQuantityButtonClick = (id, currentQuantity, change, e) => {
    e.target.style.transform = 'scale(0.9)';
    setTimeout(() => {
      e.target.style.transform = 'scale(1)';
    }, 150);
    handleQuantityChange(id, currentQuantity, change);
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <div className="empty-cart-animation">
            <div className="cart-icon">🛒</div>
            <div className="floating-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <h1 className="empty-cart-title">Your cart is empty</h1>
          <p className="empty-cart-subtitle">
            Looks like you haven't added any delicious items yet!
          </p>
          
          <div className="empty-cart-suggestions">
            <h3>Why not try:</h3>
            <div className="suggestion-tags">
              <span className="suggestion-tag">🍕 Pizza</span>
              <span className="suggestion-tag">🍔 Burgers</span>
              <span className="suggestion-tag">🍜 Noodles</span>
              <span className="suggestion-tag">🥗 Salads</span>
            </div>
          </div>
          
          <Link to="/" className="continue-shopping-btn">
            <span className="btn-icon">🍽️</span>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = 2.99;
  const subtotal = getTotal();
  const finalTotal = subtotal + deliveryFee;

  return (
    <div className="cart-screen">
      {/* Header Section */}
      <div className="cart-header">
        <div className="cart-header-content">
          <div className="header-info">
            <h1 className="cart-title">
              Your Cart
              <span className="cart-badge">{cartItems.length}</span>
            </h1>
            <p className="cart-subtitle">
              Review your delicious selections
            </p>
          </div>
          
          <div className="delivery-info">
            <div className="delivery-badge">
              <span className="delivery-icon">🚚</span><span style={{ color: "#FF6B35", display: "inline" }}>
  Free delivery on orders over $25
</span>
             
            </div>
          </div>
        </div>
      </div>

      <div className="cart-main-content">
        <div className="cart-items-section">
          <div className="items-header">
            <h2>Order Items</h2>
            <span className="items-count">{cartItems.length} items</span>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item, index) => (
              <div 
                key={item.id} 
                id={`cart-item-${item.id}`}
                className="cart-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="item-image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/120x120?text=Food";
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>

                <div className="cart-item-details">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      title="Remove item"
                    >
                      <span className="remove-icon">🗑️</span>
                    </button>
                  </div>

                  <p className="item-description">
                    {item.description || "Delicious and fresh"}
                  </p>

                  <div className="item-pricing">
                    <span className="unit-price">
                      ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"} each
                    </span>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <span className="quantity-label">Quantity:</span>
                      <div className="quantity-wrapper">
                        <button
                          className="quantity-btn decrease"
                          onClick={(e) => handleQuantityButtonClick(item.id, item.quantity, -1, e)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          className="quantity-btn increase"
                          onClick={(e) => handleQuantityButtonClick(item.id, item.quantity, 1, e)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="item-total">
                      <span className="total-label">Total:</span>
                      <span className="total-price">
                        ${typeof item.price === "number" 
                          ? (item.price * item.quantity).toFixed(2) 
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       
        <div className="cart-summary-section">
          <div className="summary-card">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <div className="summary-icon">📋</div>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${typeof subtotal === "number" ? subtotal.toFixed(2) : "0.00"}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className={subtotal >= 25 ? "free-delivery" : ""}>
                  {subtotal >= 25 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              
              <div className="summary-row taxes">
                <span>Taxes & Fees</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">
                  ${typeof finalTotal === "number" && !isNaN(finalTotal) 
                    ? (subtotal >= 25 ? subtotal : finalTotal).toFixed(2) 
                    : "0.00"}
                </span>
              </div>
            </div>

            <div className="promo-section">
              <div className="promo-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Enter promo code"
                  className="promo-input"
                />
                <button className="apply-promo-btn">Apply</button>
              </div>
            </div>

            <div className="summary-actions">
              <button
                className="checkout-btn"
                onClick={() => navigate("/order-summary")}
              >
                <span className="btn-text">Proceed to Checkout</span>
                <span className="btn-icon">→</span>
              </button>
              
              <Link to="/" className="continue-shopping-link">
                <span className="link-icon">🍽️</span>
                Continue Shopping
              </Link>
            </div>

            <div className="security-badge">
              <span className="security-icon">🔒</span>
              <span>Secure checkout guaranteed</span>
            </div>
          </div>
        </div>
      </div>

     
      <div className="recommended-section">
        <h2 className="recommended-title">You might also like</h2>
        <div className="recommended-items">
          {/* Placeholder for recommended items */}
          <div className="recommended-item">
            <div className="recommended-image">🍕</div>
            <span>Pizza Special</span>
          </div>
          <div className="recommended-item">
            <div className="recommended-image">🥤</div>
            <span>Cold Drinks</span>
          </div>
          <div className="recommended-item">
            <div className="recommended-image">🍰</div>
            <span>Desserts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
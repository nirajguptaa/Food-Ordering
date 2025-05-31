
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useCart } from '../context/CartContext';
import './OrderSummaryScreen.css';

const OrderSummaryScreen = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    instructions: ''
  });
  const [errors, setErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = getTotal();
  const deliveryFee = subtotal >= 25 ? 0 : 3.99;
  const tax = subtotal * 0.08; // 8% tax
  const finalTotal = subtotal + deliveryFee + tax;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    setIsVisible(true);
  }, [cartItems, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!customerDetails.name.trim()) newErrors.name = 'Name is required';
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerDetails.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customerDetails.address.trim()) newErrors.address = 'Delivery address is required';
    if (paymentMethod === 'UPI' && !upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    } else if (paymentMethod === 'UPI' && !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      newErrors.upiId = 'Please enter a valid UPI ID';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const generateOrderNumber = () => {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setLoading(true);
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    try {
      const orderData = {
        orderNumber: newOrderNumber,
        items: cartItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: finalTotal,
        paymentMethod,
        upiId: paymentMethod === 'UPI' ? upiId : null,
        customerDetails,
        timestamp: new Date(),
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 45 * 60000)
      };
      await addDoc(collection(db, 'orders'), orderData);
      setOrderPlaced(true);
    } catch (error) {
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    clearCart();
    navigate('/');
  };

  if (orderPlaced) {
    return (
      <div className="success-container">
        <div className="success-overlay"></div>
        <div className="success-card">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          
          <div className="success-content">
            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-message">
              Your order <span className="order-number-highlight">#{orderNumber}</span> has been placed successfully
            </p>
            
            <div className="success-details">
              <div className="success-detail">
                <span className="detail-icon">⏰</span>
                <div>
                  <span className="detail-label">Estimated Delivery</span>
                  <span className="detail-value">30-45 minutes</span>
                </div>
              </div>
              <div className="success-detail">
                <span className="detail-icon">💳</span>
                <div>
                  <span className="detail-label">Total Amount</span>
                  <span className="detail-value">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="success-info">
              <div className="info-item">
                <span className="info-icon">📱</span>
                <span>SMS confirmation sent to {customerDetails.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🚚</span>
                <span>You can track your order in real-time</span>
              </div>
            </div>
            
            <button
              onClick={handleContinueShopping}
              className="continue-button"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-summary-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-overlay"></div>
        <div className={`header-content ${isVisible ? 'fade-in-up' : 'fade-out'}`}>
          <button
            onClick={() => navigate('/cart')}
            className="back-button"
          >
            <span className="back-icon">←</span>
            Back to Cart
          </button>
          <h1 className="header-title">Complete Your Order</h1>
          <p className="header-subtitle">We're almost done! Just a few more details.</p>
        </div>
      </div>

      <div className="main-content">
        {/* Form Section */}
        <div className="form-container">
          {/* Customer Details */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📍</span>
                Delivery Information
              </h2>
              <div className="section-line"></div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={customerDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="error-message">{errors.phone}</p>}
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">
                  Delivery Address <span className="required">*</span>
                </label>
                <textarea
                  value={customerDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`form-textarea ${errors.address ? 'input-error' : ''}`}
                  placeholder="Enter complete delivery address"
                />
                {errors.address && <p className="error-message">{errors.address}</p>}
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">Special Instructions (Optional)</label>
                <input
                  type="text"
                  value={customerDetails.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  className="form-input"
                  placeholder="Any special delivery instructions"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">💳</span>
                Payment Method
              </h2>
              <div className="section-line"></div>
            </div>
            
            <div className="payment-methods">
              {[
                { value: 'COD', icon: '💰', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                { value: 'UPI', icon: '📱', label: 'UPI Payment', desc: 'Pay instantly via UPI' },
                { value: 'Online', icon: '💳', label: 'Card Payment', desc: 'Credit/Debit cards accepted' }
              ].map((method) => (
                <label 
                  key={method.value}
                  className={`payment-option ${paymentMethod === method.value ? 'payment-option-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="payment-radio"
                  />
                  <div className="payment-content">
                    <span className="payment-icon">{method.icon}</span>
                    <div className="payment-text">
                      <span className="payment-label">{method.label}</span>
                      <span className="payment-desc">{method.desc}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            {paymentMethod === 'UPI' && (
              <div className="upi-container">
                <input
                  type="text"
                  placeholder="Enter your UPI ID (e.g., name@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={`form-input ${errors.upiId ? 'input-error' : ''}`}
                />
                {errors.upiId && <p className="error-message">{errors.upiId}</p>}
              </div>
            )}
            
            {paymentMethod === 'Online' && (
              <div className="security-info">
                <span className="security-icon">🛡️</span>
                <span>Secure payment powered by Stripe. Your card details are encrypted and safe.</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="sidebar">
          <div className="summary-card">
            <div className="summary-header">
              <h2 className="summary-title">Your Order</h2>
              <span className="item-count">{cartItems.length} items</span>
            </div>
            
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'free-delivery' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row final-total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="delivery-info">
              <div className="delivery-item">
                <span className="delivery-icon">🕐</span>
                <span>Estimated delivery: 30-45 minutes</span>
              </div>
              <div className="delivery-item">
                <span className="delivery-icon">📍</span>
                <span>Free delivery on orders above $25</span>
              </div>
            </div>
            
            {errors.submit && (
              <div className="error-alert">
                <span className="error-alert-icon">⚠️</span>
                <span>{errors.submit}</span>
              </div>
            )}
            
            <button
              onClick={handleSubmitOrder}
              disabled={loading}
              className={`confirm-button ${loading ? 'confirm-button-loading' : ''}`}
            >
              {loading
                ? (paymentMethod === 'Online' ? 'Processing Payment...' : 'Placing Order...')
                : (paymentMethod === 'Online' ? 'Pay & Place Order' : 'Confirm Order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryScreen;
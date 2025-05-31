
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { getItemCount } = useCart();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
         🍽️ Delicious Foods
        </Link>
        
        <div className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Menu
          </Link>

          <Link 
            to="/cart" 
            className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            Cart {getItemCount() > 0 && <span className="cart-badge">{getItemCount()}</span>}
          </Link>

          <Link 
            to="/order-summary" 
            className={`nav-link ${location.pathname === '/order-summary' ? 'active' : ''}`}
          >
             Order Summary
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
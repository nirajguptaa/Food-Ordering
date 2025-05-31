
// App.js - Main Application Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/order-summary" element={<OrderSummaryScreen />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
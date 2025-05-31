

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

const HomeScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuItems();
    setIsVisible(true);
   
  }, []);

  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError("Failed to load menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    const button = document.getElementById(`add-btn-${item.id}`);
    if (!button) return;
    
    const originalText = button.textContent;
    const originalBg = button.style.background;
    
    button.textContent = "Added! ✓";
    button.style.background = "linear-gradient(135deg, #28a745, #20c997)";
    button.style.transform = "scale(0.95)";
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = originalBg;
      button.style.transform = "scale(1)";
    }, 1500);
  };


  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

 
  const groupedMenu = filteredItems.reduce((groups, item) => {
    const category = item.category || "Other";
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  const categories = ["All", ...new Set(menuItems.map(item => item.category || "Other"))];

  if (loading) {
    return <LoadingSpinner message="Loading delicious food..." />;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <div style={styles.errorEmoji}>😕</div>
          <h2 style={styles.errorTitle}>Oops! Something went wrong</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={fetchMenuItems} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroPattern}></div>
        
        <div style={{...styles.heroContent, ...(isVisible ? styles.fadeInUp : styles.fadeOut)}}>
          <div style={styles.heroBadge}>
            <span style={styles.lightning}>⚡</span>
            <span>Lightning Fast Delivery</span>
          </div>
          
          <h1 style={styles.heroTitle}>
            Craving Something
            <br />
            <span style={styles.heroTitleGradient}>Delicious?</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Get your favorite meals delivered fresh to your door in 30 minutes or less!
          </p>

         
          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search for dishes, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

         
          <div style={styles.locationInfo}>
            <span style={styles.locationIcon}>📍</span>
            <span>Delivering to Downtown Area</span>
          </div>
        </div>

      
        <div style={styles.floatingElement1}></div>
        <div style={styles.floatingElement2}></div>
      </div>

     
      <div style={styles.featuresSection}>
        <div style={styles.featuresContainer}>
          {[
            { icon: "⏰", title: "30 Min Delivery", desc: "Lightning fast delivery to your doorstep" },
            { icon: "🛡️", title: "Safe & Hygienic", desc: "Prepared with utmost care and hygiene" },
            { icon: "👥", title: "1M+ Happy Customers", desc: "Join millions of satisfied food lovers" }
          ].map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <span style={styles.featureEmoji}>{feature.icon}</span>
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

    
      <div style={styles.categoryFilter}>
        <div style={styles.categoryContainer}>
          <div style={styles.categoryWrapper}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category ? styles.categoryButtonActive : {})
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

     
      <div style={styles.menuSection}>
        {Object.keys(groupedMenu).length === 0 ? (
          <div style={styles.noResults}>
            <div style={styles.noResultsEmoji}>🔍</div>
            <h3 style={styles.noResultsTitle}>No items found</h3>
            <p style={styles.noResultsDesc}>Try adjusting your search or category filter</p>
          </div>
        ) : (
          Object.keys(groupedMenu).map((category, categoryIndex) => (
            <div key={category} style={styles.categorySection}>
              <div style={styles.categoryHeader}>
                <h2 style={styles.categoryTitle}>{category}</h2>
                <div style={styles.categoryLine}></div>
                <span style={styles.categoryCount}>
                  {groupedMenu[category].length} items
                </span>
              </div>
              
              <div style={styles.menuGrid}>
                {groupedMenu[category].map((item, index) => (
                  <div key={item.id} style={styles.menuCard}>
                    <div style={styles.imageContainer}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={styles.itemImage}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Food+Image";
                        }}
                      />
                      <div style={styles.imageOverlay}></div>
                      
                      {/* Rating Badge */}
                      <div style={styles.ratingBadge}>
                        <span>⭐</span>
                        <span>4.5</span>
                      </div>
                    </div>
                    
                    <div style={styles.cardContent}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemDescription}>{item.description}</p>
                      
                      <div style={styles.cardFooter}>
                        <div style={styles.priceContainer}>
                          <span style={styles.itemPrice}>
                            ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
                          </span>
                          <span style={styles.deliveryText}>Free delivery</span>
                        </div>
                        
                        <button
                          type="button"
                          id={`add-btn-${item.id}`}
                          style={styles.addButton}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

     
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>Delicious Foods</h3>
              <p style={styles.footerText}>
                Your favorite food delivery app, bringing delicious meals to your doorstep.
              </p>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerSubtitle}>Quick Links</h4>
              <ul style={styles.footerList}>
                <li><a href="#" style={styles.footerLink}>About Us</a></li>
                <li><a href="#" style={styles.footerLink}>Contact</a></li>
                <li><a href="#" style={styles.footerLink}>Help</a></li>
              </ul>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerSubtitle}>Categories</h4>
              <ul style={styles.footerList}>
                {categories.slice(1, 4).map(cat => (
                  <li key={cat}><a href="#" style={styles.footerLink}>{cat}</a></li>
                ))}
              </ul>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerSubtitle}>Follow Us</h4>
              <div style={styles.socialContainer}>
                {['F', 'T', 'I'].map((social, idx) => (
                  <div key={idx} style={styles.socialIcon}>
                    <span>{social}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Delicious Foods. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  
  heroSection: {
    position: 'relative',
    background: 'linear-gradient(135deg, #f97316, #dc2626, #ec4899)',
    overflow: 'hidden',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  heroPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30s-13.431 30-30 30S0 46.569 0 30 13.431 0 30 0zm0 6c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24S43.255 6 30 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.3
  },
  heroContent: {
    position: 'relative',
    textAlign: 'center',
    color: 'white',
    maxWidth: '800px',
    padding: '0 20px',
    transition: 'all 1s ease-out'
  },
  fadeInUp: {
    transform: 'translateY(0)',
    opacity: 1
  },
  fadeOut: {
    transform: 'translateY(40px)',
    opacity: 0
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: '25px',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'pulse 2s infinite'
  },
  lightning: {
    color: '#fbbf24'
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    fontWeight: 'bold',
    marginBottom: '24px',
    lineHeight: 1.2
  },
  heroTitleGradient: {
    background: 'linear-gradient(45deg, #fbbf24, #f97316)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
    marginBottom: '32px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 32px'
  },
  
  // Search
  searchContainer: {
    maxWidth: '400px',
    margin: '0 auto 32px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '20px',
    zIndex: 2
  },
  searchInput: {
    width: '100%',
    paddingLeft: '50px',
    paddingRight: '16px',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  
  // Location
  locationInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '18px',
    opacity: 0.9
  },
  locationIcon: {
    fontSize: '20px'
  },
  
  
  floatingElement1: {
    position: 'absolute',
    top: '80px',
    left: '40px',
    width: '64px',
    height: '64px',
    backgroundColor: '#fbbf24',
    borderRadius: '50%',
    opacity: 0.2,
    animation: 'bounce 3s infinite'
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '80px',
    right: '40px',
    width: '48px',
    height: '48px',
    backgroundColor: '#f97316',
    borderRadius: '50%',
    opacity: 0.2,
    animation: 'bounce 3s infinite 1s'
  },
  
 
  featuresSection: {
    padding: '64px 0',
    backgroundColor: 'white'
  },
  featuresContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px'
  },
  featureCard: {
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  },
  featureIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #fed7aa, #fecaca)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    transition: 'box-shadow 0.3s ease'
  },
  featureEmoji: {
    fontSize: '32px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  featureDesc: {
    color: '#6b7280'
  },
  
 
  categoryFilter: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  },
  categoryContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 20px'
  },
  categoryWrapper: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  },
  categoryButton: {
    padding: '8px 24px',
    borderRadius: '25px',
    whiteSpace: 'nowrap',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  categoryButtonActive: {
    background: 'linear-gradient(45deg, #f97316, #dc2626)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.05)'
  },
  
  
  menuSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 20px'
  },
  categorySection: {
    marginBottom: '48px'
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  categoryTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  categoryLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(to right, #fed7aa, transparent)'
  },
  categoryCount: {
    fontSize: '14px',
    color: '#6b7280',
    backgroundColor: '#fef3e2',
    padding: '4px 12px',
    borderRadius: '12px'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: '1px solid #f3f4f6',
    transition: 'all 0.5s ease',
    cursor: 'pointer'
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden'
  },
  itemImage: {
    width: '100%',
    height: '192px',
    objectFit: 'cover',
    transition: 'transform 0.7s ease'
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  ratingBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  cardContent: {
    padding: '16px'
  },
  itemName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  itemDescription: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemPrice: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f97316'
  },
  deliveryText: {
    fontSize: '12px',
    color: '#6b7280'
  },
  addButton: {
    background: 'linear-gradient(45deg, #f97316, #dc2626)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  
 
  noResults: {
    textAlign: 'center',
    padding: '64px 0'
  },
  noResultsEmoji: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  noResultsTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  noResultsDesc: {
    color: '#6b7280'
  },
  
  // Error
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #fef2f2, #fef3e2)'
  },
  errorCard: {
    textAlign: 'center',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  errorEmoji: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  errorMessage: {
    color: '#6b7280',
    marginBottom: '24px'
  },
  retryButton: {
    background: 'linear-gradient(45deg, #f97316, #dc2626)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease'
  },
  
 
  footer: {
    backgroundColor: '#111827',
    color: 'white',
    padding: '48px 0'
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px'
  },
  footerSection: {},
  footerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    background: 'linear-gradient(45deg, #fbbf24, #f97316)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  footerSubtitle: {
    fontWeight: '600',
    marginBottom: '16px'
  },
  footerText: {
    color: '#9CA3AF'
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  footerLink: {
    color: '#9CA3AF',
    textDecoration: 'none',
    display: 'block',
    padding: '4px 0',
    transition: 'color 0.3s ease'
  },
  socialContainer: {
    display: 'flex',
    gap: '16px'
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#374151',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    marginTop: '32px',
    paddingTop: '32px',
    textAlign: 'center',
    color: '#9CA3AF'
  }
};

export default HomeScreen;
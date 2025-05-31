

/**
 * Format price to display with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  return `${currency}${price.toFixed(2)}`;
};

/**
 * Calculate total price including tax and delivery fee
 * @param {number} subtotal - Subtotal amount
 * @param {number} taxRate - Tax rate (default: 0.08 for 8%)
 * @param {number} deliveryFee - Delivery fee (default: 2.99)
 * @param {number} freeDeliveryThreshold - Minimum amount for free delivery
 * @returns {object} - Object containing breakdown of costs
 */
export const calculateTotal = (subtotal, taxRate = 0.08, deliveryFee = 2.99, freeDeliveryThreshold = 25.00) => {
  const tax = subtotal * taxRate;
  const finalDeliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
  const total = subtotal + tax + finalDeliveryFee;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    deliveryFee: parseFloat(finalDeliveryFee.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    isFreeDelivery: subtotal >= freeDeliveryThreshold
  };
};

/**
 * Generate a random order number
 * @returns {string} - Random order number
 */
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Calculate estimated delivery time
 * @param {number} preparationTime - Time to prepare the order in minutes
 * @param {number} deliveryTime - Time to deliver in minutes (default: 15)
 * @returns {object} - Object with min and max delivery times
 */
export const calculateDeliveryTime = (preparationTime, deliveryTime = 15) => {
  const minTime = preparationTime + deliveryTime;
  const maxTime = minTime + 15; // Add 15 minutes buffer
  
  return {
    min: minTime,
    max: maxTime,
    display: `${minTime}-${maxTime} minutes`
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Filter menu items by category
 * @param {Array} items - Array of menu items
 * @param {string} category - Category to filter by
 * @returns {Array} - Filtered array of items
 */
export const filterItemsByCategory = (items, category) => {
  if (!category || category.toLowerCase() === 'all') {
    return items;
  }
  return items.filter(item => 
    item.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Search items by name or description
 * @param {Array} items - Array of menu items
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered array of items
 */
export const searchItems = (items, searchTerm) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term)
  );
};

/**
 * Sort items by various criteria
 * @param {Array} items - Array of menu items
 * @param {string} sortBy - Sort criteria ('name', 'price', 'rating', 'time')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted array of items
 */
export const sortItems = (items, sortBy = 'name', order = 'asc') => {
  const sortedItems = [...items].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'price':
        valueA = a.price;
        valueB = b.price;
        break;
      case 'rating':
        valueA = a.rating || 0;
        valueB = b.rating || 0;
        break;
      case 'time':
        valueA = a.preparationTime || 0;
        valueB = b.preparationTime || 0;
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }
    
    if (order === 'desc') {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
  });
  
  return sortedItems;
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Get item count by category
 * @param {Array} items - Array of menu items
 * @returns {Object} - Object with category counts
 */
export const getCategoryCounts = (items) => {
  const counts = {};
  items.forEach(item => {
    const category = item.category.toLowerCase();
    counts[category] = (counts[category] || 0) + 1;
  });
  return counts;
};

/**
 * Check if restaurant is currently open
 * @param {Object} hours - Restaurant hours object
 * @returns {boolean} - True if currently open
 */
export const isRestaurantOpen = (hours) => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const todayHours = hours[currentDay];
  if (!todayHours || todayHours.toLowerCase().includes('closed')) {
    return false;
  }
  
  // Parse hours (assuming format like "11:00 AM - 10:00 PM")
  const timeRange = todayHours.split(' - ');
  if (timeRange.length !== 2) return false;
  
  const [openTime, closeTime] = timeRange.map(time => {
    return convertTo24Hour(time.trim());
  });
  
  return currentTime >= openTime && currentTime <= closeTime;
};

/**
 * Convert 12-hour time to 24-hour format
 * @param {string} time12h - Time in 12-hour format
 * @returns {string} - Time in 24-hour format
 */
const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};
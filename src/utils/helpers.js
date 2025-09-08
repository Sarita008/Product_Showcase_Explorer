import { SORT_OPTIONS } from './constants';

// Format price with currency symbol
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Format discount percentage
export const formatDiscount = (discountPercentage) => {
  if (!discountPercentage) return '';
  return `${Math.round(discountPercentage)}% OFF`;
};

// Calculate discounted price
export const calculateDiscountedPrice = (price, discountPercentage) => {
  if (!discountPercentage) return price;
  return price - (price * discountPercentage / 100);
};

// Format rating to one decimal place
export const formatRating = (rating) => {
  if (typeof rating !== 'number') return '0.0';
  return rating.toFixed(1);
};

// Generate star rating array
export const generateStarRating = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  if (hasHalfStar) {
    stars.push('half');
  }
  
  while (stars.length < 5) {
    stars.push('empty');
  }
  
  return stars;
};

// Debounce function for search
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle function for scroll events
export const throttle = (func, delay) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
};

// Sort products based on selected option
export const sortProducts = (products, sortOption) => {
  if (!products || !Array.isArray(products)) return [];
  
  const [field, order] = sortOption.split('-');
  
  return [...products].sort((a, b) => {
    let aValue, bValue;
    
    switch (field) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'price':
        aValue = calculateDiscountedPrice(a.price, a.discountPercentage);
        bValue = calculateDiscountedPrice(b.price, b.discountPercentage);
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      default:
        return 0;
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};

// Filter products by search term
export const filterProductsBySearch = (products, searchTerm) => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.title.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.brand?.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth < 768;
};

// Check if device is tablet
export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

// Get device type
export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

// Lazy load image helper
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Get optimized image URL (if using a CDN)
export const getOptimizedImageUrl = (url, width = 400, height = 400) => {
  // This would be useful with a CDN like Cloudinary
  // For now, just return the original URL
  return url;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get random products for recommendations
export const getRandomProducts = (products, count = 4) => {
  if (!products || products.length === 0) return [];
  
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Format category name for display
export const formatCategoryName = (category) => {
  if (!category) return '';
  return category
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
};

// Get contrast color for background
export const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Local storage helpers with error handling
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return defaultValue;
  }
};
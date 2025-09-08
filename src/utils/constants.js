// API Configuration
export const API_BASE_URL = 'https://dummyjson.com';
export const BACKEND_URL = 'http://localhost:5000/api'; // For bonus backend

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/products/categories',
  CATEGORY_PRODUCTS: '/products/category',
  SINGLE_PRODUCT: '/products'
};

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const MAX_PRODUCTS_FETCH = 100;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Name: A to Z' },
  { value: 'title-desc', label: 'Name: Z to A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' }
];

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  EXTRA_SLOW: 0.8
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Cache Configuration
export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  SINGLE_PRODUCT: 10 * 60 * 1000 // 10 minutes
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_PRODUCTS: 'Failed to load products. Please try again.',
  FETCH_CATEGORIES: 'Failed to load categories. Please try again.',
  FETCH_SINGLE_PRODUCT: 'Failed to load product details. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCTS_LOADED: 'Products loaded successfully',
  CATEGORIES_LOADED: 'Categories loaded successfully'
};

// Theme Colors (for programmatic use)
export const THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#e441ff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  slideIn: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};
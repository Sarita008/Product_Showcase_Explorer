import axios from 'axios';

// Use proxy backend if available, fallback to DummyJSON directly
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_API_URL || 'https://dummyjson.com'
  : 'https://dummyjson.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(`API Error ${status}: ${data?.message || 'Something went wrong'}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Network error: Please check your internet connection');
    } else {
      // Something else happened
      throw new Error('Request failed: ' + error.message);
    }
  }
);

// API endpoints
export const endpoints = {
  products: '/products',
  categories: '/products/categories',
  productsByCategory: (category) => `/products/category/${category}`,
  productById: (id) => `/products/${id}`,
  searchProducts: '/products/search',
};

// API functions
export const api = {
  // Get all products with pagination
  async getProducts(limit = 20, skip = 0) {
    const response = await apiClient.get(endpoints.products, {
      params: { limit, skip }
    });
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(category, limit = 20, skip = 0) {
    const response = await apiClient.get(endpoints.productsByCategory(category), {
      params: { limit, skip }
    });
    return response.data;
  },

  // Get single product by ID
  async getProductById(id) {
    const response = await apiClient.get(endpoints.productById(id));
    return response.data;
  },

  // Get all categories
  async getCategories() {
    const response = await apiClient.get(endpoints.categories);
    return response.data;
  },

  // Search products
  async searchProducts(query, limit = 20, skip = 0) {
    const response = await apiClient.get(endpoints.searchProducts, {
      params: { q: query, limit, skip }
    });
    return response.data;
  },

  // Get products with advanced filtering (client-side implementation)
  async getFilteredProducts(filters = {}) {
    const { category, search, sortBy, sortOrder, limit = 100 } = filters;
    
    let products;
    
    if (search) {
      products = await this.searchProducts(search, limit);
    } else if (category && category !== 'all') {
      products = await this.getProductsByCategory(category, limit);
    } else {
      products = await this.getProducts(limit);
    }

    // Client-side sorting since DummyJSON has limited sorting support
    if (sortBy && products.products) {
      products.products.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        // Handle different data types
        if (sortBy === 'title' || sortBy === 'brand') {
          valueA = valueA?.toLowerCase() || '';
          valueB = valueB?.toLowerCase() || '';
        }

        if (sortBy === 'price' || sortBy === 'rating') {
          valueA = parseFloat(valueA) || 0;
          valueB = parseFloat(valueB) || 0;
        }

        if (sortOrder === 'desc') {
          return valueB > valueA ? 1 : valueB < valueA ? -1 : 0;
        } else {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        }
      });
    }

    return products;
  }
};

// Utility functions
export const apiUtils = {
  // Create a cache key for requests
  createCacheKey: (endpoint, params = {}) => {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}${paramString ? '?' + paramString : ''}`;
  },

  // Format price for display
  formatPrice: (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  // Calculate discount percentage
  calculateDiscount: (price, discountPercentage) => {
    const discountAmount = (price * discountPercentage) / 100;
    return {
      originalPrice: price,
      discountedPrice: price - discountAmount,
      savings: discountAmount,
      discountPercentage: Math.round(discountPercentage),
    };
  },

  // Generate placeholder image URL
  getPlaceholderImage: (width = 400, height = 400) => {
    return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=Product+Image`;
  },

  // Debounce function for search
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

export default api;
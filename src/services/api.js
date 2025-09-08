import axios from 'axios';
import { 
  API_BASE_URL, 
  BACKEND_URL, 
  API_ENDPOINTS, 
  PRODUCTS_PER_PAGE,
  ERROR_MESSAGES 
} from '@utils/constants';

// Create axios instance for DummyJSON API
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create axios instance for our backend proxy (bonus feature)
const backendClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Flag to determine if we should use backend proxy
const USE_BACKEND_PROXY = false; // Set to true to use backend proxy

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status >= 500) {
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

// Backend client interceptors (similar setup)
backendClient.interceptors.request.use(
  (config) => {
    console.log(`Backend Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

backendClient.interceptors.response.use(
  (response) => {
    console.log(`Backend Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Backend Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  constructor() {
    this.client = USE_BACKEND_PROXY ? backendClient : apiClient;
  }

  // Get all products with pagination
  async getProducts(limit = PRODUCTS_PER_PAGE, skip = 0) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.PRODUCTS}`, {
        params: { limit, skip }
      });
      
      return {
        products: response.data.products || [],
        total: response.data.total || 0,
        skip: response.data.skip || 0,
        limit: response.data.limit || limit
      };
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.FETCH_PRODUCTS);
    }
  }

  // Get single product by ID
  async getProduct(id) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.SINGLE_PRODUCT}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.FETCH_SINGLE_PRODUCT);
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const response = await this.client.get(API_ENDPOINTS.CATEGORIES);
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.FETCH_CATEGORIES);
    }
  }

  // Get products by category
  async getProductsByCategory(category, limit = PRODUCTS_PER_PAGE, skip = 0) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.CATEGORY_PRODUCTS}/${category}`, {
        params: { limit, skip }
      });
      
      return {
        products: response.data.products || [],
        total: response.data.total || 0,
        skip: response.data.skip || 0,
        limit: response.data.limit || limit,
        category
      };
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.FETCH_PRODUCTS);
    }
  }

  // Search products (DummyJSON supports search)
  async searchProducts(query, limit = PRODUCTS_PER_PAGE, skip = 0) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
        params: { q: query, limit, skip }
      });
      
      return {
        products: response.data.products || [],
        total: response.data.total || 0,
        skip: response.data.skip || 0,
        limit: response.data.limit || limit,
        query
      };
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.FETCH_PRODUCTS);
    }
  }

  // Get products with advanced filtering (client-side implementation)
  async getFilteredProducts(filters = {}) {
    try {
      const { 
        category, 
        minPrice, 
        maxPrice, 
        minRating, 
        search, 
        limit = PRODUCTS_PER_PAGE, 
        skip = 0 
      } = filters;

      let response;
      
      if (search) {
        response = await this.searchProducts(search, limit, skip);
      } else if (category && category !== 'all') {
        response = await this.getProductsByCategory(category, limit, skip);
      } else {
        response = await this.getProducts(limit, skip);
      }

      // Apply additional client-side filters
      let filteredProducts = response.products;

      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
      }

      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
      }

      if (minRating !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.rating >= minRating);
      }

      return {
        ...response,
        products: filteredProducts,
        total: filteredProducts.length
      };
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.FETCH_PRODUCTS);
    }
  }

  // Get featured products (top rated)
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await this.getProducts(30, 0); // Get more products to filter
      const featuredProducts = response.products
        .filter(product => product.rating >= 4.5)
        .slice(0, limit);
      
      return featuredProducts;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.FETCH_PRODUCTS);
    }
  }

  // Get related products by category
  async getRelatedProducts(productId, category, limit = 4) {
    try {
      const response = await this.getProductsByCategory(category, limit + 5);
      const relatedProducts = response.products
        .filter(product => product.id !== parseInt(productId))
        .slice(0, limit);
      
      return relatedProducts;
    } catch (error) {
      console.warn('Failed to fetch related products:', error.message);
      return [];
    }
  }

  // Health check for backend
  async healthCheck() {
    try {
      const response = await backendClient.get('/health');
      return response.data;
    } catch (error) {
      console.warn('Backend health check failed:', error.message);
      return { status: 'unavailable' };
    }
  }

  // Switch to backend proxy
  enableBackendProxy() {
    this.client = backendClient;
  }

  // Switch to direct API calls
  disableBackendProxy() {
    this.client = apiClient;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for convenience
export const {
  getProducts,
  getProduct,
  getCategories,
  getProductsByCategory,
  searchProducts,
  getFilteredProducts,
  getFeaturedProducts,
  getRelatedProducts,
  healthCheck
} = apiService;
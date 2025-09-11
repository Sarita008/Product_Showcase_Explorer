
// backend/src/services/dummyJsonService.js
const axios = require('axios');


class DummyJsonService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.DUMMY_JSON_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.message);
        return Promise.reject(error);
      }
    );
  }

  async getProducts(options = {}) {
    const { limit = 20, skip = 0, sortBy, order } = options;
    const params = { limit, skip };
    
    if (sortBy) params.sortBy = sortBy;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;

    const response = await this.client.get('/products', { params });
    return response.data;
  }

  async getProductById(id) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async getCategories() {
    const response = await this.client.get('/products/categories');
    return response.data;
  }

  async getProductsByCategory(category, options = {}) {
    const { limit = 20, skip = 0 } = options;
    const params = { limit, skip };

    const response = await this.client.get(`/products/category/${category}`, { params });
    return response.data;
  }

  async searchProducts(query, options = {}) {
    const { limit = 20, skip = 0 } = options;
    const params = { q: query, limit, skip };

    const response = await this.client.get('/products/search', { params });
    return response.data;
  }
}

module.exports = new DummyJsonService();

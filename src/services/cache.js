import { CACHE_DURATION } from '@utils/constants';

// In-memory cache implementation
class CacheService {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  // Generate cache key
  generateKey(prefix, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return paramString ? `${prefix}?${paramString}` : prefix;
  }

  // Set cache entry
  set(key, data, duration = CACHE_DURATION.PRODUCTS) {
    this.cache.set(key, data);
    this.timestamps.set(key, {
      created: Date.now(),
      duration
    });
    
    console.log(`Cache SET: ${key}`);
  }

  // Get cache entry
  get(key) {
    const timestamp = this.timestamps.get(key);
    
    if (!timestamp) {
      return null;
    }

    const now = Date.now();
    const isExpired = (now - timestamp.created) > timestamp.duration;

    if (isExpired) {
      this.delete(key);
      console.log(`Cache EXPIRED: ${key}`);
      return null;
    }

    const data = this.cache.get(key);
    console.log(`Cache HIT: ${key}`);
    return data;
  }

  // Check if key exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // Delete cache entry
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    console.log(`Cache DELETE: ${key}`);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.timestamps.clear();
    console.log('Cache CLEARED');
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, timestamp] of this.timestamps.entries()) {
      const isExpired = (now - timestamp.created) > timestamp.duration;
      if (isExpired) {
        this.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cache cleanup: removed ${cleanedCount} expired entries`);
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: this.getMemoryUsage()
    };
  }

  // Estimate memory usage (rough calculation)
  getMemoryUsage() {
    let totalSize = 0;
    
    for (const [key, value] of this.cache.entries()) {
      totalSize += key.length * 2; // UTF-16 characters
      totalSize += JSON.stringify(value).length * 2;
    }
    
    return {
      bytes: totalSize,
      kb: Math.round(totalSize / 1024 * 100) / 100,
      mb: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  }

  // Destroy cache service
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Cache wrapper for API calls
class ApiCache {
  constructor(cacheService) {
    this.cache = cacheService;
  }

  // Cached API call wrapper
  async getCached(cacheKey, apiCall, duration) {
    // Try to get from cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, make API call
    try {
      const data = await apiCall();
      this.cache.set(cacheKey, data, duration);
      return data;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }

  // Cache products
  async getProducts(apiCall, limit, skip) {
    const key = this.cache.generateKey('products', { limit, skip });
    return this.getCached(key, apiCall, CACHE_DURATION.PRODUCTS);
  }

  // Cache single product
  async getProduct(apiCall, id) {
    const key = this.cache.generateKey('product', { id });
    return this.getCached(key, apiCall, CACHE_DURATION.SINGLE_PRODUCT);
  }

  // Cache categories
  async getCategories(apiCall) {
    const key = 'categories';
    return this.getCached(key, apiCall, CACHE_DURATION.CATEGORIES);
  }

  // Cache category products
  async getCategoryProducts(apiCall, category, limit, skip) {
    const key = this.cache.generateKey('category-products', { category, limit, skip });
    return this.getCached(key, apiCall, CACHE_DURATION.PRODUCTS);
  }

  // Cache search results
  async getSearchResults(apiCall, query, limit, skip) {
    const key = this.cache.generateKey('search', { query, limit, skip });
    return this.getCached(key, apiCall, CACHE_DURATION.PRODUCTS);
  }

  // Invalidate related cache entries
  invalidateProducts() {
    const keys = Array.from(this.cache.cache.keys());
    const productKeys = keys.filter(key => 
      key.startsWith('products') || 
      key.startsWith('category-products') || 
      key.startsWith('search')
    );
    
    productKeys.forEach(key => this.cache.delete(key));
  }

  invalidateProduct(id) {
    const key = this.cache.generateKey('product', { id });
    this.cache.delete(key);
  }

  invalidateCategory(category) {
    const keys = Array.from(this.cache.cache.keys());
    const categoryKeys = keys.filter(key => 
      key.includes(`category=${category}`)
    );
    
    categoryKeys.forEach(key => this.cache.delete(key));
  }
}

// Create singleton instances
const cacheService = new CacheService();
const apiCache = new ApiCache(cacheService);

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cacheService.destroy();
  });
}

export default cacheService;
export { apiCache };

// Export cache management utilities
export const cacheUtils = {
  clear: () => cacheService.clear(),
  getStats: () => cacheService.getStats(),
  cleanup: () => cacheService.cleanup(),
  
  // Preload commonly used data
  async preloadData() {
    try {
      // This would be called on app initialization to preload common data
      console.log('Preloading common data...');
      // Add your preload logic here
    } catch (error) {
      console.warn('Failed to preload data:', error);
    }
  }
};
// backend/src/services/cacheService.js
const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300, // Default TTL: 5 minutes
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false, // Don't clone objects for better performance
      deleteOnExpire: true,
      maxKeys: 1000, // Maximum number of keys
    });

    // Event listeners
    this.cache.on('set', (key, value) => {
      console.log(`💾 Cache SET: ${key}`);
    });

    this.cache.on('get', (key, value) => {
      console.log(`🔍 Cache GET: ${key}`);
    });

    this.cache.on('del', (key, value) => {
      console.log(`🗑️  Cache DEL: ${key}`);
    });

    this.cache.on('expired', (key, value) => {
      console.log(`⏰ Cache EXPIRED: ${key}`);
    });
  }

  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  get(key) {
    return this.cache.get(key);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  keys() {
    return this.cache.keys();
  }

  getStats() {
    return this.cache.getStats();
  }

  // Utility methods
  has(key) {
    return this.cache.has(key);
  }

  mget(keys) {
    return this.cache.mget(keys);
  }

  mset(keyValueArray) {
    return this.cache.mset(keyValueArray);
  }

  getTtl(key) {
    return this.cache.getTtl(key);
  }

  // Cache warming - pre-populate frequently accessed data
  async warmCache() {
    try {
      console.log('🔥 Warming cache...');
      const dummyJsonService = require('./dummyJsonService');
      
      // Pre-fetch categories
      const categories = await dummyJsonService.getCategories();
      this.set('categories', categories, 3600);
      
      // Pre-fetch first page of products
      const products = await dummyJsonService.getProducts({ limit: 20, skip: 0 });
      this.set('products_20_0__', products, 300);
      
      console.log('✅ Cache warmed successfully');
    } catch (error) {
      console.error('❌ Failed to warm cache:', error.message);
    }
  }
}

module.exports = new CacheService();

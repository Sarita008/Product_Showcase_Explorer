const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const DUMMYJSON_API = 'https://dummyjson.com';

// In-memory cache implementation
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.hitCount = 0;
    this.missCount = 0;
    
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  set(key, data, ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, data);
    this.timestamps.set(key, {
      created: Date.now(),
      ttl
    });
    console.log(`[CACHE] SET: ${key} (TTL: ${ttl}ms)`);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    
    if (!timestamp) {
      this.missCount++;
      return null;
    }

    const now = Date.now();
    const isExpired = (now - timestamp.created) > timestamp.ttl;

    if (isExpired) {
      this.delete(key);
      this.missCount++;
      console.log(`[CACHE] EXPIRED: ${key}`);
      return null;
    }

    const data = this.cache.get(key);
    this.hitCount++;
    console.log(`[CACHE] HIT: ${key}`);
    return data;
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, timestamp] of this.timestamps.entries()) {
      const isExpired = (now - timestamp.created) > timestamp.ttl;
      if (isExpired) {
        this.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[CACHE] Cleanup: removed ${cleanedCount} expired entries`);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      hits: this.hitCount,
      misses: this.missCount,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0,
      keys: Array.from(this.cache.keys())
    };
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
    console.log('[CACHE] Cleared all entries');
  }
}

// Initialize cache
const cache = new MemoryCache();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Cache key generator
function generateCacheKey(req) {
  const { path, query } = req;
  const queryString = Object.keys(query)
    .sort()
    .map(key => `${key}=${query[key]}`)
    .join('&');
  
  return queryString ? `${path}?${queryString}` : path;
}

// Generic proxy handler with caching
async function proxyWithCache(req, res, endpoint, ttl = 5 * 60 * 1000) {
  const cacheKey = generateCacheKey(req);
  
  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        _cached: true,
        _cacheKey: cacheKey
      });
    }

    // Make API request
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `${DUMMYJSON_API}${endpoint}${queryParams ? '?' + queryParams : ''}`;
    
    console.log(`[API] Fetching: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ProductHub-Backend/1.0',
        'Accept': 'application/json'
      }
    });

    const data = response.data;
    
    // Cache the response
    cache.set(cacheKey, data, ttl);

    // Return data with cache metadata
    res.json({
      ...data,
      _cached: false,
      _cacheKey: cacheKey,
      _timestamp: Date.now()
    });

  } catch (error) {
    console.error(`[ERROR] API request failed:`, error.message);
    
    // Return appropriate error response
    if (error.response) {
      res.status(error.response.status).json({
        error: 'API request failed',
        message: error.response.data?.message || error.message,
        status: error.response.status
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({
        error: 'Request timeout',
        message: 'The request took too long to complete'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch data from external API'
      });
    }
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const stats = cache.getStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: stats,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
    }
  });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  proxyWithCache(req, res, '/products', 5 * 60 * 1000); // 5 minutes
});

app.get('/api/products/search', (req, res) => {
  proxyWithCache(req, res, '/products/search', 2 * 60 * 1000); // 2 minutes
});

app.get('/api/products/categories', (req, res) => {
  proxyWithCache(req, res, '/products/categories', 30 * 60 * 1000); // 30 minutes
});

app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  proxyWithCache(req, res, `/products/category/${category}`, 10 * 60 * 1000); // 10 minutes
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  proxyWithCache(req, res, `/products/${id}`, 10 * 60 * 1000); // 10 minutes
});

// Cache management endpoints
app.get('/api/cache/stats', (req, res) => {
  res.json(cache.getStats());
});

app.post('/api/cache/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

app.delete('/api/cache/:key', (req, res) => {
  const { key } = req.params;
  const decoded = decodeURIComponent(key);
  
  if (cache.cache.has(decoded)) {
    cache.delete(decoded);
    res.json({ message: `Cache entry '${decoded}' deleted successfully` });
  } else {
    res.status(404).json({ message: `Cache entry '${decoded}' not found` });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('[ERROR] Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SERVER] Received SIGTERM, shutting down gracefully');
  cache.clear();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[SERVER] Received SIGINT, shutting down gracefully');
  cache.clear();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 ProductHub Backend Server Started!
📡 Server running on port ${PORT}
🔗 API Base URL: http://localhost:${PORT}/api
📊 Health Check: http://localhost:${PORT}/api/health
💾 Cache Stats: http://localhost:${PORT}/api/cache/stats

Available Endpoints:
  GET  /api/products                    - Get all products with pagination
  GET  /api/products/search?q=term      - Search products
  GET  /api/products/categories         - Get all categories
  GET  /api/products/category/:name     - Get products by category
  GET  /api/products/:id                - Get single product
  GET  /api/health                      - Health check and stats
  GET  /api/cache/stats                 - Cache statistics
  POST /api/cache/clear                 - Clear all cache
  
Features:
  ✅ In-memory caching with TTL
  ✅ Rate limiting protection
  ✅ Comprehensive error handling
  ✅ Request/response logging
  ✅ Cache hit/miss statistics
  ✅ Graceful shutdown handling
  `);
});

module.exports = app;
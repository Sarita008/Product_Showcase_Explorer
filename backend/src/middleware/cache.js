
// backend/src/middleware/cache.js
const cacheService = require('../services/cacheService');

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query parameters
    const cacheKey = `${req.originalUrl}_${JSON.stringify(req.query)}`;
    
    // Try to get cached response
    const cachedResponse = cacheService.get(cacheKey);
    
    if (cachedResponse) {
      console.log(`🎯 Cache HIT: ${cacheKey}`);
      return res.json({
        ...cachedResponse,
        cached: true,
        cacheHit: true
      });
    }

    console.log(`💨 Cache MISS: ${cacheKey}`);

    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(body) {
      // Cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService.set(cacheKey, body, duration);
      }
      
      // Call original json method
      return originalJson.call(this, body);
    };

    next();
  };
};

module.exports = { cacheMiddleware };


// backend/src/controllers/productController.js
const dummyJsonService = require('../services/dummyJsonService');
const cacheService = require('../services/cacheService');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { limit = 20, skip = 0, sortBy, order } = req.query;
      
      const cacheKey = `products_${limit}_${skip}_${sortBy}_${order}`;
      
      // Try to get from cache first
      let products = cacheService.get(cacheKey);
      
      if (!products) {
        products = await dummyJsonService.getProducts({
          limit: parseInt(limit),
          skip: parseInt(skip),
          sortBy,
          order
        });
        
        // Cache for 5 minutes
        cacheService.set(cacheKey, products, 300);
      }

      res.json({
        success: true,
        data: products,
        cached: !!products.cached,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `product_${id}`;
      
      let product = cacheService.get(cacheKey);
      
      if (!product) {
        product = await dummyJsonService.getProductById(id);
        cacheService.set(cacheKey, product, 600); // 10 minutes cache
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      res.json({
        success: true,
        data: product,
        cached: !!product.cached,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const cacheKey = 'categories';
      
      let categories = cacheService.get(cacheKey);
      
      if (!categories) {
        categories = await dummyJsonService.getCategories();
        cacheService.set(cacheKey, categories, 3600); // 1 hour cache
      }

      res.json({
        success: true,
        data: categories,
        cached: !!categories.cached,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const { limit = 20, skip = 0 } = req.query;
      
      const cacheKey = `category_${category}_${limit}_${skip}`;
      
      let products = cacheService.get(cacheKey);
      
      if (!products) {
        products = await dummyJsonService.getProductsByCategory(category, {
          limit: parseInt(limit),
          skip: parseInt(skip)
        });
        cacheService.set(cacheKey, products, 300); // 5 minutes cache
      }

      res.json({
        success: true,
        data: products,
        cached: !!products.cached,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { q, limit = 20, skip = 0 } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
      }

      const cacheKey = `search_${q}_${limit}_${skip}`;
      
      let results = cacheService.get(cacheKey);
      
      if (!results) {
        results = await dummyJsonService.searchProducts(q, {
          limit: parseInt(limit),
          skip: parseInt(skip)
        });
        cacheService.set(cacheKey, results, 180); // 3 minutes cache
      }

      res.json({
        success: true,
        data: results,
        cached: !!results.cached,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();

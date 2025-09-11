

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { cacheMiddleware } = require('../middleware/cache');

// Routes with caching
router.get('/', cacheMiddleware(300), productController.getAllProducts); // 5 minutes cache
router.get('/categories', cacheMiddleware(3600), productController.getCategories); // 1 hour cache
router.get('/search', cacheMiddleware(180), productController.searchProducts); // 3 minutes cache
router.get('/category/:category', cacheMiddleware(300), productController.getProductsByCategory);
router.get('/:id', cacheMiddleware(600), productController.getProductById); // 10 minutes cache

module.exports = router;

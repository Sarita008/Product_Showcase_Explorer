import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { ProductDetailSkeleton } from '../ui/SkeletonLoader';
import { apiUtils } from '../../services/api';

const ProductDetail = ({ 
  product, 
  loading = false, 
  error = null,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  onClose
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          <Shield size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load product details
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onClose} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Product not found</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const images = product.images || [product.thumbnail];
  const discount = apiUtils.calculateDiscount(product.price, product.discountPercentage || 0);
  const hasDiscount = product.discountPercentage > 0;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(product);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onLoad={() => setImageLoading(false)}
              />
            </AnimatePresence>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <motion.div
                className="absolute top-4 left-4"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {discount.discountPercentage}% OFF
                </div>
              </motion.div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? 'border-primary-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Information */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Header */}
          <div>
            <motion.p 
              variants={itemVariants}
              className="text-sm text-primary-600 font-medium uppercase tracking-wider mb-2"
            >
              {product.category}
            </motion.p>
            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {product.title}
            </motion.h1>
          </div>

          {/* Rating and Reviews */}
          <motion.div variants={itemVariants} className="flex items-center space-x-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-900">
              {product.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-500">
              (Based on customer reviews)
            </span>
          </motion.div>

          {/* Price */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {apiUtils.formatPrice(hasDiscount ? discount.discountedPrice : product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {apiUtils.formatPrice(product.price)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                    Save {apiUtils.formatPrice(discount.savings)}
                  </span>
                </>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm text-green-600 font-medium">
                Limited time offer - {discount.discountPercentage}% off!
              </p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </motion.div>

          {/* Product Details */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku || product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty:</span>
                  <span className="font-medium">{product.warrantyInformation || '1 Year'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">{product.shippingInformation || 'Free shipping'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quantity Selector */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="text-gray-600">
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="lg"
              className="flex-1"
              leftIcon={<ShoppingCart size={20} />}
            >
              {product.stock === 0 ? 'Out of Stock' : `Add to Cart - ${apiUtils.formatPrice((hasDiscount ? discount.discountedPrice : product.price) * quantity)}`}
            </Button>
            <Button
              onClick={handleToggleFavorite}
              variant="outline"
              size="lg"
              className="px-4"
            >
              <Heart 
                size={20} 
                className={`${
                  isFavorite 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600'
                }`} 
              />
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Truck className="text-primary-600" size={20} />
              <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="text-primary-600" size={20} />
              <span className="text-sm text-gray-600">2-year warranty included</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="text-primary-600" size={20} />
              <span className="text-sm text-gray-600">30-day return policy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="text-primary-600" size={20} />
              <span className="text-sm text-gray-600">Trusted by thousands</span>
            </div>
          </motion.div>

          {/* Additional Information */}
          {(product.tags && product.tags.length > 0) && (
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
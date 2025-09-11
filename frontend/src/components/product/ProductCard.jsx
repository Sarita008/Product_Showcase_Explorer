import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye, Badge } from 'lucide-react';
import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { apiUtils } from '../../services/api';

const ProductCard = ({ 
  product, 
  onViewDetails, 
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  index = 0,
  layoutId 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const discount = apiUtils.calculateDiscount(product.price, product.discountPercentage || 0);
  const hasDiscount = product.discountPercentage > 0;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    loading: { scale: 1.1, opacity: 0.7 },
    loaded: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails?.(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(product);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layoutId={layoutId}
      className="group"
    >
      <Card className="overflow-hidden h-full flex flex-col relative">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Discount Badge */}
          {hasDiscount && (
            <motion.div
              className="absolute top-2 left-2 z-10"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
            >
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Badge size={12} />
                {discount.discountPercentage}% OFF
              </div>
            </motion.div>
          )}

          {/* Favorite Button */}
          <motion.button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              size={16} 
              className={`transition-colors ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </motion.button>

          {/* Product Image */}
          <motion.div
            variants={imageVariants}
            animate={imageLoading ? "loading" : "loaded"}
            className="w-full h-full"
          >
            {!imageError ? (
              <img
                src={product.thumbnail || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-gray-400 text-center">
                  <Eye size={40} className="mx-auto mb-2" />
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Loading overlay */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Hover overlay with quick actions */}
          <motion.div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            initial={false}
          >
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleViewDetails}
                leftIcon={<Eye size={16} />}
              >
                View
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                leftIcon={<ShoppingCart size={16} />}
              >
                Add
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <motion.p 
            className="text-xs text-primary-600 font-medium uppercase tracking-wider mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {product.category}
          </motion.p>

          {/* Title */}
          <motion.h3 
            className="font-semibold text-gray-900 mb-2 line-clamp-2 flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {product.title}
          </motion.h3>

          {/* Rating */}
          <motion.div 
            className="flex items-center mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating?.toFixed(1) || '0.0'}
            </span>
          </motion.div>

          {/* Price */}
          <motion.div 
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {apiUtils.formatPrice(hasDiscount ? discount.discountedPrice : product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {apiUtils.formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.stock < 10 && product.stock > 0 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {product.stock} left
              </span>
            )}
          </motion.div>

          {/* Stock status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            {product.stock === 0 ? (
              <div className="text-red-600 text-sm font-medium">Out of Stock</div>
            ) : (
              <div className="text-green-600 text-sm font-medium">In Stock</div>
            )}
          </motion.div>

          {/* Quick add to cart button - mobile */}
          <motion.div
            className="mt-4 sm:hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.7 }}
          >
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              leftIcon={<ShoppingCart size={16} />}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Zap,
  Tag,
  Package
} from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@contexts/AppContext';
import { useAnimation } from '@hooks/useAnimation';
import { 
  formatPrice, 
  formatRating, 
  formatDiscount, 
  calculateDiscountedPrice,
  truncateText 
} from '@utils/helpers';
import Button from '@components/common/Button';

const ProductCard = ({ 
  product, 
  className = '', 
  showQuickView = true,
  showAddToCart = true,
  layout = 'grid' // 'grid' or 'list'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { openModal } = useAppContext();
  const { animationsEnabled, useHoverAnimation, usePulseAnimation } = useAnimation();
  const { isHovered, hoverProps } = useHoverAnimation();
  const { isPulsing } = usePulseAnimation(isFavorite);

  // Calculate discount
  const originalPrice = product.price;
  const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Handle quick view
  const handleQuickView = (e) => {
    e.stopPropagation();
    openModal('productDetail', { productId: product.id });
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product.title);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Card variants for animation
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: animationsEnabled ? 0.4 : 0,
        ease: "easeOut"
      }
    },
    hover: {
      scale: animationsEnabled ? 1.02 : 1,
      y: animationsEnabled ? -5 : 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    loading: { 
      scale: 1.1,
      filter: 'blur(4px)'
    },
    loaded: { 
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: animationsEnabled ? 0.3 : 0,
        ease: "easeOut"
      }
    }
  };

  if (layout === 'list') {
    return (
      <motion.div
        className={clsx(
          'bg-white rounded-2xl shadow-card hover:shadow-card-hover',
          'border border-white/20 backdrop-blur-sm',
          'transition-all duration-300 cursor-pointer overflow-hidden',
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={handleQuickView}
        {...hoverProps}
      >
        <div className="flex p-4 sm:p-6 space-x-4">
          {/* Image */}
          <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative rounded-xl overflow-hidden bg-secondary-100">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-secondary-200 animate-pulse" />
            )}
            
            {!imageError ? (
              <motion.img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
                variants={imageVariants}
                animate={imageLoaded ? 'loaded' : 'loading'}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary-100 text-secondary-400">
                <Package size={32} />
              </div>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <motion.div
                className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {formatDiscount(product.discountPercentage)}
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-secondary-900 truncate">
                {product.title}
              </h3>
              
              <motion.button
                onClick={handleFavoriteToggle}
                className={clsx(
                  'p-2 rounded-full transition-colors',
                  isFavorite ? 'text-red-500' : 'text-secondary-400 hover:text-red-500'
                )}
                whileTap={{ scale: animationsEnabled ? 0.9 : 1 }}
                animate={{ scale: isPulsing && animationsEnabled ? [1, 1.2, 1] : 1 }}
              >
                <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
              </motion.button>
            </div>

            <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
              {truncateText(product.description, 100)}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xl font-bold text-secondary-900">
                    {formatPrice(discountedPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-secondary-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-secondary-600">
                      {formatRating(product.rating)}
                    </span>
                  </div>
                  <span className="text-sm text-secondary-500">
                    {product.stock} left
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Eye />}
                  onClick={handleQuickView}
                />
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ShoppingCart />}
                  onClick={handleAddToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout (default)
  return (
    <motion.div
      className={clsx(
        'group bg-white rounded-2xl shadow-card hover:shadow-card-hover',
        'border border-white/20 backdrop-blur-sm overflow-hidden',
        'transition-all duration-300 cursor-pointer',
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={handleQuickView}
      {...hoverProps}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary-100 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-secondary-200 animate-pulse" />
        )}
        
        {!imageError ? (
          <motion.img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            variants={imageVariants}
            animate={imageLoaded ? 'loaded' : 'loading'}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary-100 text-secondary-400">
            <Package size={48} />
          </div>
        )}

        {/* Overlay Actions */}
        <motion.div
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          {showQuickView && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Eye />}
              onClick={handleQuickView}
              className="bg-white/90 backdrop-blur-sm"
            >
              Quick View
            </Button>
          )}
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {hasDiscount && (
            <motion.div
              className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 200,
                damping: 10
              }}
            >
              <Tag size={10} className="mr-1" />
              {formatDiscount(product.discountPercentage)}
            </motion.div>
          )}
          
          {product.stock <= 5 && (
            <motion.div
              className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Zap size={10} className="mr-1" />
              Low Stock
            </motion.div>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          onClick={handleFavoriteToggle}
          className={clsx(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all',
            isFavorite 
              ? 'bg-red-100 text-red-500' 
              : 'bg-white/80 text-secondary-400 hover:text-red-500 hover:bg-red-50'
          )}
          whileTap={{ scale: animationsEnabled ? 0.9 : 1 }}
          whileHover={{ scale: animationsEnabled ? 1.1 : 1 }}
          animate={{ 
            scale: isPulsing && animationsEnabled ? [1, 1.2, 1] : 1 
          }}
          transition={{ duration: 0.6 }}
        >
          <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Brand */}
        <div>
          <h3 className="font-semibold text-secondary-900 text-lg leading-tight line-clamp-2">
            {product.title}
          </h3>
          {product.brand && (
            <p className="text-secondary-500 text-sm mt-1">
              {product.brand}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-secondary-600 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Stock */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <Star size={14} className="text-yellow-400 fill-current mr-1" />
              <span className="text-secondary-700 font-medium">
                {formatRating(product.rating)}
              </span>
            </div>
            <span className="text-secondary-500">
              {product.stock} in stock
            </span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-secondary-900">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-secondary-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {showAddToCart && (
            <Button
              variant="primary"
              size="sm"
              icon={<ShoppingCart />}
              onClick={handleAddToCart}
              className="min-w-0"
            >
              <span className="hidden sm:inline">Add to Cart</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/SkeletonLoader';
import Button from '../ui/Button';
import { ChevronDown, Grid, List, Filter } from 'lucide-react';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null,
  hasMore = false,
  onLoadMore,
  onViewDetails,
  onAddToCart,
  onToggleFavorite,
  favorites = [],
  viewMode = 'grid',
  onViewModeChange,
  showLoadMore = true
}) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      await onLoadMore?.();
    } finally {
      setLoadingMore(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const gridVariants = {
    grid: {
      transition: {
        staggerChildren: 0.05
      }
    },
    list: {
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  // Handle loading state
  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  // Handle error state
  if (error && products.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load products
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  // Handle empty state
  if (!loading && products.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 20l3-3 3 3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Showing {products.length} products
          </span>
        </div>
        
        {onViewModeChange && (
          <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              } transition-all duration-200`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              } transition-all duration-200`}
            >
              <List size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={gridVariants[viewMode]}
                layout
                layoutId={`product-${product.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05
                }}
              >
                {viewMode === 'grid' ? (
                  <ProductCard
                    product={product}
                    index={index}
                    onViewDetails={onViewDetails}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                    layoutId={`product-card-${product.id}`}
                  />
                ) : (
                  <ProductListItem
                    product={product}
                    index={index}
                    onViewDetails={onViewDetails}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Load More Button */}
      {showLoadMore && hasMore && (
        <motion.div
          className="flex justify-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleLoadMore}
            loading={loadingMore}
            variant="outline"
            size="lg"
            rightIcon={!loadingMore && <ChevronDown size={20} />}
          >
            {loadingMore ? 'Loading...' : 'Load More Products'}
          </Button>
        </motion.div>
      )}

      {/* Loading more indicator */}
      {loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductGridSkeleton count={4} />
        </div>
      )}
    </div>
  );
};

// Product List Item for list view
const ProductListItem = ({ 
  product, 
  index, 
  onViewDetails, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite 
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex">
        {/* Image */}
        <div className="w-32 h-32 flex-shrink-0 bg-gray-100">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-primary-600 font-medium uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {product.description}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(product);
                }}
                className="p-1 ml-2"
              >
                <Heart 
                  size={16} 
                  className={`transition-colors ${
                    isFavorite 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`} 
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              <div className="flex items-center">
                <Star size={14} className="text-yellow-400 fill-current mr-1" />
                <span className="text-sm text-gray-600">
                  {product.rating?.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(product);
                }}
              >
                View
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(product);
                }}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductGrid;
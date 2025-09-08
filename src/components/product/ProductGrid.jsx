import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Grid, List } from 'lucide-react';
import clsx from 'clsx';
import { useAnimation } from '@hooks/useAnimation';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { StaggerContainer } from '@components/animation/ScrollTrigger';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null,
  showFilters = true,
  initialView = 'grid',
  className = ''
}) => {
  const [view, setView] = useState(initialView);
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    rating: 0,
    priceMin: 0,
    priceMax: 1000
  });

  const { animationsEnabled } = useAnimation();

  // Extract unique categories and brands from products
  const { categories, brands, priceRange } = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    const brds = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const prices = products.map(p => p.price).filter(Boolean);
    
    return {
      categories: cats,
      brands: brds,
      priceRange: {
        min: Math.floor(Math.min(...prices, 0)),
        max: Math.ceil(Math.max(...prices, 1000))
      }
    };
  }, [products]);

  // Update filter price range when products change
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price).filter(Boolean);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      
      setFilters(prev => ({
        ...prev,
        priceMin: prev.priceMin === 0 ? minPrice : prev.priceMin,
        priceMax: prev.priceMax === 1000 ? maxPrice : prev.priceMax
      }));
    }
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    filtered = filtered.filter(p => 
      p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animationsEnabled ? 0.1 : 0,
        delayChildren: animationsEnabled ? 0.1 : 0,
      }
    }
  };

  const itemVariants = {
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
        duration: animationsEnabled ? 0.4 : 0,
        ease: "easeOut"
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={clsx("space-y-6", className)}>
        {showFilters && (
          <div className="animate-pulse">
            <div className="h-12 bg-secondary-200 rounded-lg mb-4 lg:hidden"></div>
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
              <div className="lg:w-64 lg:flex-shrink-0">
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <div className="h-6 bg-secondary-200 rounded mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-5 bg-secondary-200 rounded"></div>
                        <div className="space-y-2">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="h-4 bg-secondary-200 rounded w-3/4"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-12 bg-secondary-200 rounded-lg mb-6"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden">
                      <div className="aspect-square bg-secondary-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-secondary-200 rounded"></div>
                        <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                        <div className="h-6 bg-secondary-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 size={32} className="animate-spin text-primary-500" />
            <p className="text-secondary-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={clsx("flex flex-col items-center justify-center py-12", className)}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-secondary-600 text-center max-w-md mb-4">
          {error.message || 'Failed to load products. Please try again later.'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className={clsx("flex flex-col items-center justify-center py-12", className)}>
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          No products available
        </h3>
        <p className="text-secondary-600 text-center max-w-md">
          We couldn't find any products at the moment. Please check back later or try browsing other categories.
        </p>
      </div>
    );
  }

  // No results after filtering
  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className={clsx("space-y-6", className)}>
        {showFilters && (
          <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
            <div className="lg:w-64 lg:flex-shrink-0">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
                brands={brands}
                priceRange={priceRange}
                showViewToggle={false}
                view={view}
                onViewChange={handleViewChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                totalProducts={filteredAndSortedProducts.length}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <span className="text-secondary-600">
                  0 products found
                </span>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-white border border-secondary-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  
                  <div className="flex border border-secondary-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setView('grid')}
                      className={clsx(
                        'p-2 transition-colors',
                        view === 'grid' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white text-secondary-600 hover:bg-secondary-50'
                      )}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={clsx(
                        'p-2 transition-colors',
                        view === 'list' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white text-secondary-600 hover:bg-secondary-50'
                      )}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-5xl mb-6">🔍</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  No products match your filters
                </h3>
                <p className="text-secondary-600 text-center max-w-md mb-6">
                  Try adjusting your filters or search criteria to see more products. You can also clear all filters to browse our full catalog.
                </p>
                <button
                  onClick={() => setFilters({
                    categories: [],
                    brands: [],
                    rating: 0,
                    priceMin: priceRange.min,
                    priceMax: priceRange.max
                  })}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("space-y-6", className)}>
      {showFilters ? (
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Sidebar Filters */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              brands={brands}
              priceRange={priceRange}
              showViewToggle={true}
              view={view}
              onViewChange={handleViewChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              totalProducts={filteredAndSortedProducts.length}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${view}-${sortBy}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={clsx(
                  'transition-all duration-300',
                  view === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
                    : 'space-y-4'
                )}
              >
                {filteredAndSortedProducts.map((product, index) => (
                  <motion.div
                    key={`${product.id}-${view}`}
                    layout
                    variants={itemVariants}
                    whileHover={animationsEnabled ? { y: -5 } : {}}
                    transition={{ 
                      layout: { duration: animationsEnabled ? 0.3 : 0 },
                      hover: { duration: 0.2 }
                    }}
                    style={{
                      animationDelay: animationsEnabled ? `${index * 0.05}s` : '0s'
                    }}
                  >
                    <ProductCard
                      product={product}
                      layout={view}
                      showQuickView={true}
                      showAddToCart={true}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button (if needed) */}
            {filteredAndSortedProducts.length >= 12 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-12"
              >
                <button className="px-8 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg font-medium transition-colors">
                  Load More Products
                </button>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* No Filters - Full Width Grid */
        <div>
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-secondary-600">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
              </span>
              {(filters.categories.length > 0 || filters.brands.length > 0 || filters.rating > 0) && (
                <button
                  onClick={() => setFilters({
                    categories: [],
                    brands: [],
                    rating: 0,
                    priceMin: priceRange.min,
                    priceMax: priceRange.max
                  })}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-secondary-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="name">Name: A to Z</option>
              </select>
              
              <div className="flex border border-secondary-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={clsx(
                    'p-2 transition-colors',
                    view === 'grid' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white text-secondary-600 hover:bg-secondary-50'
                  )}
                  title="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={clsx(
                    'p-2 transition-colors',
                    view === 'list' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white text-secondary-600 hover:bg-secondary-50'
                  )}
                  title="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`no-filters-${view}-${sortBy}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={clsx(
                'transition-all duration-300',
                view === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
                  : 'space-y-4'
              )}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={`${product.id}-${view}-no-filters`}
                  layout
                  variants={itemVariants}
                  whileHover={animationsEnabled ? { y: -5 } : {}}
                  transition={{ 
                    layout: { duration: animationsEnabled ? 0.3 : 0 },
                    hover: { duration: 0.2 }
                  }}
                  style={{
                    animationDelay: animationsEnabled ? `${index * 0.03}s` : '0s'
                  }}
                >
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout={view}
                    showQuickView={true}
                    showAddToCart={true}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Load More Button */}
          {filteredAndSortedProducts.length >= 20 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-12"
            >
              <button className="px-8 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg font-medium transition-colors">
                Load More Products
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
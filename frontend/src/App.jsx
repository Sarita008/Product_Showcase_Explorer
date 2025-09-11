import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProductGrid from './components/product/ProductGrid';
import ProductDetail from './components/product/ProductDetail';
import CategoryFilter from './components/filters/CategoryFilter';
import SortOptions from './components/filters/SortOptions';
import SearchBar from './components/filters/SearchBar';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import { FilterSkeleton } from './components/ui/SkeletonLoader';
import { useProducts } from './hooks/useProducts';
import { useApp } from './contexts/AppContext';
import { useProduct } from './hooks/useProducts';
import { Filter, X, RotateCcw } from 'lucide-react';

function App() {
  const { state, actions } = useApp();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Main products hook
  const {
    products,
    loading: productsLoading,
    error: productsError,
    hasMore,
    total,
    filters,
    updateFilters,
    loadMore,
    refresh,
    resetFilters,
    isEmpty,
    isFiltered,
  } = useProducts({
    category: state.filters.category,
    search: state.filters.search,
    sortBy: state.filters.sortBy,
    sortOrder: state.filters.sortOrder,
  });

  // Single product hook for modal
  const {
    product: selectedProduct,
    loading: productLoading,
    error: productError
  } = useProduct(selectedProductId);

  // Search handler
  const handleSearch = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
    actions.setFilters({ search: searchTerm });
  }, [updateFilters, actions]);

  // Category change handler
  const handleCategoryChange = useCallback((category) => {
    updateFilters({ category });
    actions.setFilters({ category });
  }, [updateFilters, actions]);

  // Sort change handler
  const handleSortChange = useCallback((sortBy, sortOrder) => {
    updateFilters({ sortBy, sortOrder });
    actions.setFilters({ sortBy, sortOrder });
  }, [updateFilters, actions]);

  // Product detail handlers
  const handleViewDetails = useCallback((product) => {
    setSelectedProductId(product.id);
    actions.openProductModal(product);
  }, [actions]);

  const handleCloseProductModal = useCallback(() => {
    setSelectedProductId(null);
    actions.closeProductModal();
  }, [actions]);

  // Cart and favorites handlers
  const handleAddToCart = useCallback((product, quantity = 1) => {
    actions.addToCart(product, quantity);
    toast.success(`Added ${product.title} to cart!`, {
      icon: '🛒',
    });
  }, [actions]);

  const handleToggleFavorite = useCallback((product) => {
    const isFavorite = state.isFavorite(product.id);
    actions.toggleFavorite(product);
    
    if (isFavorite) {
      toast.success('Removed from favorites', {
        icon: '💔',
      });
    } else {
      toast.success('Added to favorites!', {
        icon: '❤️',
      });
    }
  }, [actions, state]);

  // View mode handler
  const handleViewModeChange = useCallback((mode) => {
    actions.setViewMode(mode);
  }, [actions]);

  // Reset filters handler
  const handleResetFilters = useCallback(() => {
    resetFilters();
    actions.resetFilters();
    setShowMobileFilters(false);
    toast.success('Filters reset!');
  }, [resetFilters, actions]);

  // Error handler
  useEffect(() => {
    if (productsError) {
      actions.setError(productsError);
      toast.error('Failed to load products');
    }
  }, [productsError, actions]);

  // Loading state
  const isLoading = productsLoading && products.length === 0;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <Layout
      searchProps={{
        onSearch: handleSearch,
        searchValue: filters.search,
        searchLoading: productsLoading,
      }}
    >
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container-custom py-8"
      >
        {/* Hero Section */}
        <motion.section variants={sectionVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover Amazing{' '}
            <span className="text-gradient">Products</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore thousands of quality products from trusted brands. 
            Find exactly what you're looking for with our smart filters and search.
          </p>
          
          {/* Desktop Search */}
          <div className="hidden md:block max-w-2xl mx-auto mb-8">
            <SearchBar
              value={filters.search}
              onSearch={handleSearch}
              loading={productsLoading}
              placeholder="Search for anything..."
              size="lg"
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-primary-600">{total}+</span>
              <span className="ml-1">Products</span>
            </div>
            <div>
              <span className="font-semibold text-primary-600">20+</span>
              <span className="ml-1">Categories</span>
            </div>
            <div>
              <span className="font-semibold text-primary-600">100%</span>
              <span className="ml-1">Quality</span>
            </div>
          </div>
        </motion.section>

        {/* Filters Section */}
        <motion.section variants={sectionVariants} className="mb-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setShowMobileFilters(true)}
              leftIcon={<Filter size={16} />}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Filters & Sort
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <CategoryFilter
                  selectedCategory={filters.category}
                  onCategoryChange={handleCategoryChange}
                />
                <SortOptions
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSortChange={handleSortChange}
                />
                <div className="flex flex-col justify-end">
                  {isFiltered && (
                    <Button
                      onClick={handleResetFilters}
                      variant="outline"
                      size="sm"
                      leftIcon={<RotateCcw size={16} />}
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <AnimatePresence>
            {isFiltered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {filters.category !== 'all' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    Category: {filters.category}
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="ml-2 hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                )}
                {filters.search && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleSearch('')}
                      className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Products Section */}
        <motion.section variants={sectionVariants}>
          <ProductGrid
            products={products}
            loading={productsLoading}
            error={productsError}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onViewDetails={handleViewDetails}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            favorites={state.favorites.map(f => f.id)}
            viewMode={state.viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </motion.section>
      </motion.div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        title="Filters & Sort"
        size="sm"
      >
        <div className="p-6 space-y-8">
          {isLoading ? (
            <FilterSkeleton />
          ) : (
            <>
              <CategoryFilter
                selectedCategory={filters.category}
                onCategoryChange={handleCategoryChange}
              />
              <SortOptions
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
              />
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  variant="primary"
                  className="flex-1"
                >
                  Apply Filters
                </Button>
                {isFiltered && (
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    leftIcon={<RotateCcw size={16} />}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Product Detail Modal */}
      <Modal
        isOpen={state.isProductModalOpen}
        onClose={handleCloseProductModal}
        size="xl"
        closeOnBackdrop={true}
      >
        <ProductDetail
          product={selectedProduct}
          loading={productLoading}
          error={productError}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={selectedProduct ? state.isFavorite(selectedProduct.id) : false}
          onClose={handleCloseProductModal}
        />
      </Modal>
    </Layout>
  );
}

export default App;
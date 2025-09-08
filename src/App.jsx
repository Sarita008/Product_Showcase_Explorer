import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import Layout from '@components/layout/Layout';

// Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

// Context and Hooks
import { useAppContext } from '@contexts/AppContext';
import { useProducts } from '@hooks/useProducts';
import { useCategories } from '@hooks/useCategories';

// Modals
import ProductModal from '@components/product/ProductModal';
import FiltersModal from '@components/product/ProductFilters';

// Services
import { cacheUtils } from '@services/cache';

function App() {
  const { 
    isInitialized,
    modals,
    closeModal
  } = useAppContext();

  const { fetchProducts } = useProducts();
  const { fetchCategories } = useCategories();

  // Initialize app data
  useEffect(() => {
    if (isInitialized) {
      initializeApp();
    }
  }, [isInitialized]);

  const initializeApp = async () => {
    try {
      // Preload cache and common data
      await cacheUtils.preloadData();
      
      // Fetch initial data
      await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup cache and resources
      cacheUtils.cleanup();
    };
  }, []);

  if (!isInitialized) {
    return null; // Loading handled in Layout component
  }

  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {modals.productDetail.isOpen && (
            <ProductModal
              productId={modals.productDetail.productId}
              onClose={() => closeModal('productDetail')}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modals.filters.isOpen && (
            <FiltersModal
              onClose={() => closeModal('filters')}
            />
          )}
        </AnimatePresence>
      </Layout>
    </Router>
  );
}

export default App;
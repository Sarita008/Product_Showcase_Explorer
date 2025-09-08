import { useCallback, useEffect } from 'react';
import { useAppContext } from '@contexts/AppContext';
import apiService from '@services/api';
import { apiCache } from '@services/cache';
import { LOADING_STATES, ERROR_MESSAGES } from '@utils/constants';
import { sortProducts, filterProductsBySearch } from '@utils/helpers';

export const useProducts = () => {
  const {
    products,
    totalProducts,
    filters,
    pagination,
    loading,
    error,
    setLoading,
    setError,
    clearError,
    setProducts,
    addProducts,
    setCurrentPage,
    setPagination
  } = useAppContext();

  // Fetch products with filters
  const fetchProducts = useCallback(async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(LOADING_STATES.LOADING);
        clearError();
      }

      const skip = loadMore ? products.length : 0;
      const limit = pagination.itemsPerPage;

      let response;

      // Use cached API calls
      if (filters.searchTerm) {
        response = await apiCache.getSearchResults(
          () => apiService.searchProducts(filters.searchTerm, limit, skip),
          filters.searchTerm,
          limit,
          skip
        );
      } else if (filters.category && filters.category !== 'all') {
        response = await apiCache.getCategoryProducts(
          () => apiService.getProductsByCategory(filters.category, limit, skip),
          filters.category,
          limit,
          skip
        );
      } else {
        response = await apiCache.getProducts(
          () => apiService.getProducts(limit, skip),
          limit,
          skip
        );
      }

      // Apply sorting
      let sortedProducts = sortProducts(response.products, filters.sortBy);

      // Apply additional client-side filters
      if (filters.Price > 0 || filters.maxPrice < 1000) {
        sortedProducts = sortedProducts.filter(product => {
          const price = product.price - (product.price * product.discountPercentage / 100);
          return price >= filters.minPrice && price <= filters.maxPrice;
        });
      }

      if (filters.minRating > 0) {
        sortedProducts = sortedProducts.filter(product => product.rating >= filters.minRating);
      }

      if (loadMore) {
        addProducts(sortedProducts, response.total);
      } else {
        setProducts(sortedProducts, response.total);
        setPagination({
          ...pagination,
          totalPages: Math.ceil(response.total / pagination.itemsPerPage)
        });
      }

      setLoading(LOADING_STATES.SUCCESS);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || ERROR_MESSAGES.FETCH_PRODUCTS);
    }
  }, [
    filters, 
    pagination.itemsPerPage, 
    products.length,
    setLoading, 
    setError, 
    clearError, 
    setProducts, 
    addProducts, 
    setPagination
  ]);

  // Fetch single product
  const fetchProduct = useCallback(async (id) => {
    try {
      setLoading(LOADING_STATES.LOADING);
      clearError();

      const product = await apiCache.getProduct(
        () => apiService.getProduct(id),
        id
      );

      setLoading(LOADING_STATES.SUCCESS);
      return product;
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError(err.message || ERROR_MESSAGES.FETCH_SINGLE_PRODUCT);
      throw err;
    }
  }, [setLoading, setError, clearError]);

  // Load more products (infinite scroll)
  const loadMoreProducts = useCallback(() => {
    if (loading === LOADING_STATES.LOADING) return;
    if (products.length >= totalProducts) return;
    
    fetchProducts(true);
  }, [fetchProducts, loading, products.length, totalProducts]);

  // Refresh products
  const refreshProducts = useCallback(() => {
    // Clear cache for products
    apiCache.invalidateProducts();
    setCurrentPage(1);
    fetchProducts(false);
  }, [fetchProducts, setCurrentPage]);

  // Check if we can load more
  const canLoadMore = products.length < totalProducts && loading !== LOADING_STATES.LOADING;

  // Check if we have products
  const hasProducts = products.length > 0;

  // Check if currently loading
  const isLoading = loading === LOADING_STATES.LOADING;

  // Check if has error
  const hasError = loading === LOADING_STATES.ERROR && error !== null;

  return {
    // Data
    products,
    totalProducts,
    
    // State
    loading,
    error,
    isLoading,
    hasError,
    hasProducts,
    canLoadMore,
    
    // Actions
    fetchProducts,
    fetchProduct,
    loadMoreProducts,
    refreshProducts
  };
};

export default useProducts;
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters state
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sortBy: 'title',
    sortOrder: 'asc',
    limit: 20,
    skip: 0,
    ...initialFilters
  });

  // Fetch products function
  const fetchProducts = useCallback(async (newFilters = filters, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getFilteredProducts(newFilters);
      
      if (response && response.products) {
        setProducts(prevProducts => 
          append ? [...prevProducts, ...response.products] : response.products
        );
        setTotal(response.total || response.products.length);
        setHasMore(response.products.length === newFilters.limit);
      } else {
        setProducts([]);
        setTotal(0);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      if (!append) {
        setProducts([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load more products (pagination)
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const newFilters = {
      ...filters,
      skip: products.length
    };

    await fetchProducts(newFilters, true);
  }, [filters, products.length, loading, hasMore, fetchProducts]);

  // Update filters and refetch
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      skip: 0 // Reset pagination when filters change
    };
    
    setFilters(updatedFilters);
    fetchProducts(updatedFilters, false);
  }, [filters, fetchProducts]);

  // Refresh products
  const refresh = useCallback(() => {
    fetchProducts(filters, false);
  }, [filters, fetchProducts]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      category: 'all',
      search: '',
      sortBy: 'title',
      sortOrder: 'asc',
      limit: 20,
      skip: 0
    };
    
    setFilters(defaultFilters);
    fetchProducts(defaultFilters, false);
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []); // Only run on mount

  return {
    // Data
    products,
    loading,
    error,
    hasMore,
    total,
    filters,
    
    // Actions
    updateFilters,
    loadMore,
    refresh,
    resetFilters,
    
    // Computed values
    isEmpty: !loading && products.length === 0,
    isFiltered: filters.category !== 'all' || filters.search !== '',
  };
};

// Hook for single product
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getProductById(id);
      setProduct(response);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  const refetch = useCallback(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch
  };
};

export default useProducts;
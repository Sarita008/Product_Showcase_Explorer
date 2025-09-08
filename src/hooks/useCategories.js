import { useCallback, useEffect } from 'react';
import { useAppContext } from '@contexts/AppContext';
import apiService from '@services/api';
import { apiCache } from '@services/cache';
import { LOADING_STATES, ERROR_MESSAGES } from '@utils/constants';
import { formatCategoryName, capitalize } from '@utils/helpers';

export const useCategories = () => {
  const {
    categories,
    filters,
    loading,
    error,
    setLoading,
    setError,
    clearError,
    setCategories,
    setFilter
  } = useAppContext();

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(LOADING_STATES.LOADING);
      clearError();

      const categoriesData = await apiCache.getCategories(
        () => apiService.getCategories()
      );

      // Format categories for display
      const formattedCategories = categoriesData.map(category => ({
        value: category,
        label: formatCategoryName(category),
        slug: category
      }));

      setCategories(formattedCategories);
      setLoading(LOADING_STATES.SUCCESS);
      
      return formattedCategories;
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err.message || ERROR_MESSAGES.FETCH_CATEGORIES);
      throw err;
    }
  }, [setLoading, setError, clearError, setCategories]);

  // Set active category
  const setActiveCategory = useCallback((category) => {
    setFilter('category', category);
  }, [setFilter]);

  // Get category by slug
  const getCategoryBySlug = useCallback((slug) => {
    return categories.find(cat => cat.slug === slug);
  }, [categories]);

  // Get formatted category name
  const getFormattedCategoryName = useCallback((category) => {
    if (category === 'all') return 'All Products';
    return formatCategoryName(category);
  }, []);

  // Check if category is active
  const isCategoryActive = useCallback((category) => {
    return filters.category === category;
  }, [filters.category]);

  // Get categories with 'All' option
  const categoriesWithAll = [
    { value: 'all', label: 'All Products', slug: 'all' },
    ...categories
  ];

  // Get popular categories (you could enhance this with analytics)
  const getPopularCategories = useCallback((limit = 6) => {
    // For now, just return the first N categories
    // In a real app, you'd sort by popularity metrics
    return categories.slice(0, limit);
  }, [categories]);

  // Search categories
  const searchCategories = useCallback((searchTerm) => {
    if (!searchTerm) return categories;
    
    const term = searchTerm.toLowerCase();
    return categories.filter(category =>
      category.label.toLowerCase().includes(term) ||
      category.slug.toLowerCase().includes(term)
    );
  }, [categories]);

  // Get category stats (if you had this data)
  const getCategoryStats = useCallback((category) => {
    // This would come from your analytics or API
    // For now, return mock data
    return {
      productCount: 0,
      averageRating: 0,
      priceRange: { min: 0, max: 0 }
    };
  }, []);

  return {
    // Data
    categories,
    categoriesWithAll,
    activeCategory: filters.category,
    
    // State
    loading,
    error,
    isLoading: loading === LOADING_STATES.LOADING,
    hasError: loading === LOADING_STATES.ERROR && error !== null,
    hasCategories: categories.length > 0,
    
    // Actions
    fetchCategories,
    setActiveCategory,
    getCategoryBySlug,
    getFormattedCategoryName,
    isCategoryActive,
    getPopularCategories,
    searchCategories,
    getCategoryStats
  };
};

export default useCategories;
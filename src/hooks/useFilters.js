import { useCallback, useMemo } from 'react';
import { useAppContext } from '@contexts/AppContext';
import { SORT_OPTIONS } from '@utils/constants';
import { debounce } from '@utils/helpers';

export const useFilters = () => {
  const {
    filters,
    products,
    setFilter,
    setFilters,
    resetFilters,
    setCurrentPage
  } = useAppContext();

  // Set individual filter
  const updateFilter = useCallback((key, value) => {
    setFilter(key, value);
  }, [setFilter]);

  // Set multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Set search term with debouncing
  const debouncedSetSearch = useMemo(
    () => debounce((searchTerm) => {
      setFilter('searchTerm', searchTerm);
    }, 300),
    [setFilter]
  );

  const setSearchTerm = useCallback((term) => {
    debouncedSetSearch(term);
  }, [debouncedSetSearch]);

  // Set category filter
  const setCategory = useCallback((category) => {
    updateFilter('category', category);
  }, [updateFilter]);

  // Set sort option
  const setSortBy = useCallback((sortOption) => {
    updateFilter('sortBy', sortOption);
  }, [updateFilter]);

  // Set price range
  const setPriceRange = useCallback((min, max) => {
    updateFilters({
      minPrice: min,
      maxPrice: max
    });
  }, [updateFilters]);

  // Set minimum rating
  const setMinRating = useCallback((rating) => {
    updateFilter('minRating', rating);
  }, [updateFilter]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Clear specific filter
  const clearFilter = useCallback((filterKey) => {
    const defaultValues = {
      category: 'all',
      sortBy: 'title-asc',
      searchTerm: '',
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0
    };
    
    updateFilter(filterKey, defaultValues[filterKey]);
  }, [updateFilter]);

  // Toggle category (useful for mobile filters)
  const toggleCategory = useCallback((category) => {
    if (filters.category === category) {
      setCategory('all');
    } else {
      setCategory(category);
    }
  }, [filters.category, setCategory]);

  // Get price range from products
  const getPriceRange = useCallback(() => {
    if (!products.length) return { min: 0, max: 1000 };
    
    const prices = products.map(product => 
      product.price - (product.price * product.discountPercentage / 100)
    );
    
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Get available ratings
  const getAvailableRatings = useCallback(() => {
    return [
      { value: 0, label: 'All Ratings', count: products.length },
      { value: 4, label: '4+ Stars', count: products.filter(p => p.rating >= 4).length },
      { value: 4.5, label: '4.5+ Stars', count: products.filter(p => p.rating >= 4.5).length },
      { value: 5, label: '5 Stars', count: products.filter(p => p.rating === 5).length }
    ];
  }, [products]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== 'all' ||
      filters.searchTerm !== '' ||
      filters.minPrice > 0 ||
      filters.maxPrice < 1000 ||
      filters.minRating > 0 ||
      filters.sortBy !== 'title-asc'
    );
  }, [filters]);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.searchTerm !== '') count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000) count++;
    if (filters.minRating > 0) count++;
    if (filters.sortBy !== 'title-asc') count++;
    return count;
  }, [filters]);

  // Get filter summary for display
  const getFilterSummary = useCallback(() => {
    const summary = [];
    
    if (filters.category !== 'all') {
      summary.push(`Category: ${filters.category}`);
    }
    
    if (filters.searchTerm) {
      summary.push(`Search: "${filters.searchTerm}"`);
    }
    
    if (filters.minPrice > 0 || filters.maxPrice < 1000) {
      summary.push(`Price: $${filters.minPrice} - $${filters.maxPrice}`);
    }
    
    if (filters.minRating > 0) {
      summary.push(`Rating: ${filters.minRating}+ stars`);
    }
    
    if (filters.sortBy !== 'title-asc') {
      const sortOption = SORT_OPTIONS.find(opt => opt.value === filters.sortBy);
      summary.push(`Sort: ${sortOption?.label}`);
    }
    
    return summary;
  }, [filters]);

  // Validate price range
  const isValidPriceRange = useCallback((min, max) => {
    return min >= 0 && max > min && max <= 10000;
  }, []);

  // Get sort options
  const sortOptions = SORT_OPTIONS;

  // Get current sort option
  const currentSortOption = useMemo(() => {
    return SORT_OPTIONS.find(option => option.value === filters.sortBy);
  }, [filters.sortBy]);

  return {
    // Current filters
    filters,
    
    // Filter actions
    updateFilter,
    updateFilters,
    setSearchTerm,
    setCategory,
    setSortBy,
    setPriceRange,
    setMinRating,
    clearAllFilters,
    clearFilter,
    toggleCategory,
    
    // Helper functions
    getPriceRange,
    getAvailableRatings,
    getFilterSummary,
    isValidPriceRange,
    
    // State
    hasActiveFilters,
    activeFiltersCount,
    sortOptions,
    currentSortOption,
    
    // Computed values
    isSearching: filters.searchTerm !== '',
    isCategoryFiltered: filters.category !== 'all',
    isPriceFiltered: filters.minPrice > 0 || filters.maxPrice < 1000,
    isRatingFiltered: filters.minRating > 0,
    isSorted: filters.sortBy !== 'title-asc'
  };
};

export default useFilters;
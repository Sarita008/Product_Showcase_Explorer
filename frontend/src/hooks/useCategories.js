import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getCategories();
      let categoryName = [];
      response.forEach(element => {
        categoryName.push(element.slug)
      });
      // Add 'all' option at the beginning
      const allCategories = ['all', ...categoryName];
      setCategories(allCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      setCategories(['all']); // Fallback to just 'all' option
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Format category name for display
const formatCategoryName = useCallback((category) => {
  if (!category || typeof category !== 'string') return 'Unknown';

  if (category === 'all') return 'All Products';
  
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}, []);


  // Get category icon (you can expand this with more icons)
  const getCategoryIcon = useCallback((category) => {
    const iconMap = {
      'all': '🏪',
      'smartphones': '📱',
      'laptops': '💻',
      'fragrances': '🌸',
      'skincare': '🧴',
      'groceries': '🛒',
      'home-decoration': '🏠',
      'furniture': '🪑',
      'tops': '👕',
      'womens-dresses': '👗',
      'womens-shoes': '👠',
      'mens-shirts': '👔',
      'mens-shoes': '👞',
      'mens-watches': '⌚',
      'womens-watches': '⌚',
      'womens-bags': '👜',
      'womens-jewellery': '💎',
      'sunglasses': '🕶️',
      'automotive': '🚗',
      'motorcycle': '🏍️',
      'lighting': '💡'
    };
    
    return iconMap[category] || '📦';
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch,
    formatCategoryName,
    getCategoryIcon,
    isEmpty: !loading && categories.length <= 1 // Only 'all' means no categories loaded
  };
};

export default useCategories;
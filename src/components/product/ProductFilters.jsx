import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Star,
  DollarSign,
  Tag,
  Grid,
  List,
  SortAsc
} from 'lucide-react';
import clsx from 'clsx';
import { useAnimation } from '@hooks/useAnimation';
import Button from '@components/common/Button';

const ProductFilters = ({ 
  filters = {}, 
  onFilterChange, 
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000 },
  showViewToggle = true,
  view = 'grid',
  onViewChange,
  sortBy = 'default',
  onSortChange,
  totalProducts = 0,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);
  const [selectedBrands, setSelectedBrands] = useState(filters.brands || []);
  const [selectedRating, setSelectedRating] = useState(filters.rating || 0);
  const [priceMin, setPriceMin] = useState(filters.priceMin || priceRange.min);
  const [priceMax, setPriceMax] = useState(filters.priceMax || priceRange.max);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true
  });

  const { animationsEnabled } = useAnimation();

  // Update filters when state changes
  useEffect(() => {
    onFilterChange?.({
      categories: selectedCategories,
      brands: selectedBrands,
      rating: selectedRating,
      priceMin,
      priceMax
    });
  }, [selectedCategories, selectedBrands, selectedRating, priceMin, priceMax, onFilterChange]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(selectedRating === rating ? 0 : rating);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRating(0);
    setPriceMin(priceRange.min);
    setPriceMax(priceRange.max);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedBrands.length > 0 || 
    selectedRating > 0 || 
    priceMin > priceRange.min || 
    priceMax < priceRange.max;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  const filterVariants = {
    hidden: { 
      opacity: 0, 
      x: -300,
      transition: { duration: animationsEnabled ? 0.3 : 0 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: animationsEnabled ? 0.3 : 0,
        staggerChildren: animationsEnabled ? 0.1 : 0
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: animationsEnabled ? 0.3 : 0 }
    }
  };

  const FilterSection = ({ title, children, sectionKey, icon: Icon }) => (
    <motion.div variants={itemVariants} className="border-b border-secondary-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <div className="flex items-center">
          {Icon && <Icon size={18} className="mr-2 text-secondary-500" />}
          <span className="font-medium text-secondary-900">{title}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={clsx(
            'text-secondary-500 transition-transform',
            expandedSections[sectionKey] && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: animationsEnabled ? 0.2 : 0 }}
            className="pb-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="secondary"
          icon={<Filter />}
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          Filters {hasActiveFilters && `(${selectedCategories.length + selectedBrands.length + (selectedRating > 0 ? 1 : 0)})`}
        </Button>
      </div>

      {/* Top Bar - Sort and View Controls */}
      <div className={clsx("flex items-center justify-between mb-6", className)}>
        <div className="flex items-center space-x-4">
          <span className="text-secondary-600">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear all filters
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="appearance-none bg-white border border-secondary-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SortAsc size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex border border-secondary-300 rounded-lg overflow-hidden">
              <button
                onClick={() => onViewChange?.('grid')}
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
                onClick={() => onViewChange?.('list')}
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
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:block bg-white rounded-2xl shadow-card p-6"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-0">
          {/* Categories */}
          {categories.length > 0 && (
            <FilterSection title="Categories" sectionKey="categories" icon={Tag}>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="ml-3 text-secondary-700 group-hover:text-secondary-900 transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <FilterSection title="Brands" sectionKey="brands" icon={Tag}>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="ml-3 text-secondary-700 group-hover:text-secondary-900 transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Price Range */}
          <FilterSection title="Price Range" sectionKey="price" icon={DollarSign}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    min={priceRange.min}
                    max={priceMax}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    min={priceMin}
                    max={priceRange.max}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Price Range Slider */}
              <div className="relative">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                  className="absolute w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="absolute w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
              </div>
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Rating" sectionKey="rating" icon={Star}>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 text-primary-600 bg-white border-secondary-300 focus:ring-primary-500 focus:ring-2"
                  />
                  <div className="ml-3 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={clsx(
                          i < rating 
                            ? "text-yellow-400 fill-current" 
                            : "text-secondary-300"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-secondary-700 text-sm">
                      & up
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </motion.div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-secondary-200 p-4 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900">Filters</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Same filter sections as desktop, but in mobile layout */}
                <div className="space-y-0">
                  {/* Categories */}
                  {categories.length > 0 && (
                    <FilterSection title="Categories" sectionKey="categories" icon={Tag}>
                      <div className="space-y-3">
                        {categories.map(category => (
                          <label key={category} className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 focus:ring-2"
                            />
                            <span className="ml-3 text-secondary-700 group-hover:text-secondary-900 transition-colors">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Brands */}
                  {brands.length > 0 && (
                    <FilterSection title="Brands" sectionKey="brands" icon={Tag}>
                      <div className="space-y-3">
                        {brands.map(brand => (
                          <label key={brand} className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => handleBrandToggle(brand)}
                              className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 focus:ring-2"
                            />
                            <span className="ml-3 text-secondary-700 group-hover:text-secondary-900 transition-colors">
                              {brand}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Price Range */}
                  <FilterSection title="Price Range" sectionKey="price" icon={DollarSign}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">
                            Min Price
                          </label>
                          <input
                            type="number"
                            value={priceMin}
                            onChange={(e) => setPriceMin(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-secondary-700 mb-1">
                            Max Price
                          </label>
                          <input
                            type="number"
                            value={priceMax}
                            onChange={(e) => setPriceMax(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </FilterSection>

                  {/* Rating */}
                  <FilterSection title="Rating" sectionKey="rating" icon={Star}>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <label key={rating} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="rating-mobile"
                            checked={selectedRating === rating}
                            onChange={() => handleRatingChange(rating)}
                            className="w-4 h-4 text-primary-600 bg-white border-secondary-300"
                          />
                          <div className="ml-3 flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={clsx(
                                  i < rating 
                                    ? "text-yellow-400 fill-current" 
                                    : "text-secondary-300"
                                )}
                              />
                            ))}
                            <span className="ml-2 text-secondary-700 text-sm">
                              & up
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                </div>

                {/* Mobile Actions */}
                <div className="mt-8 space-y-3">
                  {hasActiveFilters && (
                    <Button
                      variant="secondary"
                      onClick={clearAllFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductFilters;
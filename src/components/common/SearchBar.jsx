import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Package } from 'lucide-react';
import clsx from 'clsx';
import { useAnimation } from '@hooks/useAnimation';
import { useFilters } from '@hooks/useFilters';
import { debounce } from '@utils/helpers';

const SearchBar = ({
  placeholder = 'Search products...',
  onSearch = () => {},
  suggestions = [],
  showSuggestions = true,
  recentSearches = [],
  trendingSearches = [],
  size = 'md',
  fullWidth = false,
  className = '',
  autoFocus = false,
  clearOnSubmit = false
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const { animationsEnabled, useHoverAnimation } = useAnimation();
  const { filters, setSearchTerm } = useFilters();
  const { isHovered, hoverProps } = useHoverAnimation();

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce((searchQuery) => {
      setSearchTerm(searchQuery);
      onSearch(searchQuery);
    }, 300),
    [setSearchTerm, onSearch]
  );

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-10',
      input: 'text-sm px-4',
      icon: 16,
      dropdown: 'mt-2'
    },
    md: {
      container: 'h-12',
      input: 'text-base px-5',
      icon: 18,
      dropdown: 'mt-3'
    },
    lg: {
      container: 'h-14',
      input: 'text-lg px-6',
      icon: 20,
      dropdown: 'mt-4'
    }
  };

  const config = sizeConfig[size];

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
    setShowDropdown(value.length > 0 || isFocused);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions) {
      setShowDropdown(true);
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    // Don't hide dropdown if clicking on dropdown item
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      return;
    }
    
    setIsFocused(false);
    setTimeout(() => setShowDropdown(false), 150);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      debouncedSearch(query.trim());
      if (clearOnSubmit) {
        setQuery('');
      }
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const searchQuery = typeof suggestion === 'string' ? suggestion : suggestion.query;
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSearchTerm('');
    onSearch('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const containerClasses = clsx(
    'relative',
    {
      'w-full': fullWidth,
      'w-auto': !fullWidth
    },
    className
  );

  const inputContainerClasses = clsx(
    'relative flex items-center bg-white rounded-2xl border-2 transition-all duration-300',
    config.container,
    {
      'border-primary-300 shadow-lg ring-4 ring-primary-100': isFocused,
      'border-secondary-200 shadow-md hover:border-secondary-300': !isFocused,
      'transform scale-105': isHovered && animationsEnabled,
    }
  );

  const inputClasses = clsx(
    'flex-1 bg-transparent outline-none placeholder-secondary-400',
    config.input
  );

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: animationsEnabled ? 0.2 : 0,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className={containerClasses}>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 1 }}
        whileTap={{ scale: animationsEnabled ? 0.98 : 1 }}
        className={inputContainerClasses}
        {...hoverProps}
      >
        {/* Search Icon */}
        <motion.div
          className="flex-shrink-0 pl-4"
          whileTap={{ scale: animationsEnabled ? 0.9 : 1 }}
        >
          <Search 
            size={config.icon} 
            className={clsx(
              'transition-colors duration-200',
              isFocused ? 'text-primary-500' : 'text-secondary-400'
            )}
          />
        </motion.div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClasses}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              onClick={clearSearch}
              className="flex-shrink-0 p-2 mr-2 rounded-full hover:bg-secondary-100 transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileTap={{ scale: animationsEnabled ? 0.9 : 1 }}
            >
              <X size={config.icon - 2} className="text-secondary-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && showSuggestions && (
          <motion.div
            ref={dropdownRef}
            className={clsx(
              'absolute left-0 right-0 z-50 bg-white rounded-2xl border border-secondary-200 shadow-xl max-h-80 overflow-y-auto',
              config.dropdown
            )}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="p-4 border-b border-secondary-100">
                <div className="flex items-center mb-3 text-sm text-secondary-600">
                  <Clock size={14} className="mr-2" />
                  Recent Searches
                </div>
                {recentSearches.slice(0, 3).map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="block w-full text-left px-3 py-2 hover:bg-secondary-50 rounded-lg text-sm transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: animationsEnabled ? index * 0.05 : 0 }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {trendingSearches.length > 0 && !query && (
              <div className="p-4 border-b border-secondary-100">
                <div className="flex items-center mb-3 text-sm text-secondary-600">
                  <TrendingUp size={14} className="mr-2" />
                  Trending Searches
                </div>
                {trendingSearches.slice(0, 3).map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="block w-full text-left px-3 py-2 hover:bg-secondary-50 rounded-lg text-sm transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: animationsEnabled ? index * 0.05 : 0 }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && query && (
              <div className="p-4">
                <div className="flex items-center mb-3 text-sm text-secondary-600">
                  <Package size={14} className="mr-2" />
                  Suggestions
                </div>
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left px-3 py-2 hover:bg-secondary-50 rounded-lg text-sm transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: animationsEnabled ? index * 0.05 : 0 }}
                  >
                    <div className="flex items-center">
                      <Search size={12} className="mr-2 text-secondary-400" />
                      {typeof suggestion === 'string' ? suggestion : suggestion.title}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query && suggestions.length === 0 && (
              <motion.div
                className="p-8 text-center text-secondary-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Package size={32} className="mx-auto mb-2 text-secondary-300" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs text-secondary-400 mt-1">
                  Try searching for something else
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
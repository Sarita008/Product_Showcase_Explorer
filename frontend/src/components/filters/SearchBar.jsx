import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ 
  value = '', 
  onSearch,
  placeholder = "Search products...",
  loading = false,
  showClearButton = true,
  size = 'md',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== value) {
      onSearch?.(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch, value]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
  };

  const sizes = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg',
  };

  const containerVariants = {
    focused: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    unfocused: {
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    searching: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    },
    idle: {
      rotate: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={isFocused ? "focused" : "unfocused"}
      className={`relative ${className}`}
    >
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <motion.div
            variants={iconVariants}
            animate={loading ? "searching" : "idle"}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 text-gray-400" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </motion.div>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 border border-gray-300 rounded-lg 
            bg-white text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-all duration-200
            ${sizes[size]}
            ${isFocused ? 'shadow-md border-primary-300' : 'shadow-sm'}
          `}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {showClearButton && searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-150"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search Suggestions (placeholder for future enhancement) */}
      <AnimatePresence>
        {isFocused && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
          >
            <div className="p-2">
              <p className="text-sm text-gray-500 px-3 py-2">
                Press Enter to search for "{searchTerm}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
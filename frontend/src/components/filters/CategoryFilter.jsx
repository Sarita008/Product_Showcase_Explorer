// CategoryFilter.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import Button from '../ui/Button';

const CategoryFilter = ({ 
  selectedCategory = 'all', 
  onCategoryChange,
  showAsDropdown = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, loading, formatCategoryName, getCategoryIcon } = useCategories();

  const handleCategorySelect = (category) => {
    onCategoryChange?.(category);
    if (showAsDropdown) {
      setIsOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

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
        duration: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (showAsDropdown) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          rightIcon={<ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
          leftIcon={<Filter size={16} />}
        >
          {formatCategoryName(selectedCategory)}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto"
              >
                <div className="p-2">
                  {categories.map((category, i) => (
                    <button
                      key={i}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <span>{formatCategoryName(category)}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
        Categories
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category, i) => (
          <motion.button
            key={i}
            variants={itemVariants}
            onClick={() => handleCategorySelect(category)}
            className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-primary-600 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700'
            }`}
            whileHover={{ scale: selectedCategory === category ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{getCategoryIcon(category)}</span>
            <span>{formatCategoryName(category)}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;


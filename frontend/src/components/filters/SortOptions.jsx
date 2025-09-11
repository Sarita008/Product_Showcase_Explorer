// SortOptions.jsx
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const SortOptions = ({ 
  sortBy = 'title', 
  sortOrder = 'asc', 
  onSortChange,
  showAsDropdown = false 
}) => {
  const sortOptions = [
    { value: 'title', label: 'Name', icon: ArrowUpDown },
    { value: 'price', label: 'Price', icon: ArrowUpDown },
    { value: 'rating', label: 'Rating', icon: ArrowUpDown },
  ];

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same field is selected
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      onSortChange?.(newSortBy, newOrder);
    } else {
      // New field selected, default to ascending
      onSortChange?.(newSortBy, 'asc');
    }
  };

  const getSortIcon = (optionValue) => {
    if (sortBy === optionValue) {
      return sortOrder === 'asc' ? ArrowUp : ArrowDown;
    }
    return ArrowUpDown;
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

  if (showAsDropdown) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            onSortChange?.(field, order);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {sortOptions.map((option) => (
            <optgroup key={option.value} label={option.label}>
              <option value={`${option.value}-asc`}>
                {option.label} (A-Z)
              </option>
              <option value={`${option.value}-desc`}>
                {option.label} (Z-A)
              </option>
            </optgroup>
          ))}
        </select>
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
        Sort By
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const IconComponent = getSortIcon(option.value);
          const isActive = sortBy === option.value;
          
          return (
            <motion.button
              key={option.value}
              variants={itemVariants}
              onClick={() => handleSortChange(option.value)}
              className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent size={16} />
              <span>{option.label}</span>
              {isActive && (
                <span className="text-xs opacity-75">
                  ({sortOrder === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SortOptions;
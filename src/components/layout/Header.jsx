import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Grid, 
  List,
  Filter,
  Settings,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@contexts/AppContext';
import { useAnimation } from '@hooks/useAnimation';
import SearchBar from '@components/common/SearchBar';
import Button from '@components/common/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const {
    preferences,
    setPreference,
    openModal,
    computed
  } = useAppContext();
  
  const { animationsEnabled, useHoverAnimation } = useAnimation();
  const { isHovered: isLogoHovered, hoverProps: logoHoverProps } = useHoverAnimation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle grid/list view
  const toggleViewMode = () => {
    setPreference('gridView', !preferences.gridView);
  };

  // Toggle theme (if you implement dark mode)
  const toggleTheme = () => {
    setPreference('theme', preferences.theme === 'light' ? 'dark' : 'light');
  };

  // Toggle animations
  const toggleAnimations = () => {
    setPreference('animationsEnabled', !preferences.animationsEnabled);
  };

  // Open filters modal
  const openFilters = () => {
    openModal('filters');
  };

  const headerClasses = clsx(
    'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
    {
      'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg': isScrolled,
      'bg-transparent': !isScrolled
    }
  );

  const containerClasses = clsx(
    'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'flex items-center justify-between',
    'h-16 sm:h-18 lg:h-20'
  );

  return (
    <motion.header
      className={headerClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: animationsEnabled ? 0.5 : 0,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      <div className={containerClasses}>
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2"
          {...logoHoverProps}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: isLogoHovered && animationsEnabled ? [0, 5, -5, 0] : 0,
              scale: isLogoHovered && animationsEnabled ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag size={20} className="text-white" />
            </div>
            {animationsEnabled && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: animationsEnabled ? 0.2 : 0 }}
          >
            <h1 className="text-xl sm:text-2xl font-heading font-bold gradient-text">
              ProductHub
            </h1>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isLogoHovered ? '100%' : '60%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>

        {/* Desktop Search Bar */}
        <motion.div
          className="hidden md:flex flex-1 max-w-2xl mx-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationsEnabled ? 0.3 : 0 }}
        >
          <SearchBar
            placeholder="Search products, brands, categories..."
            fullWidth
            suggestions={[]}
            recentSearches={['iPhone', 'Laptop', 'Headphones']}
            trendingSearches={['Gaming', 'Fashion', 'Electronics']}
          />
        </motion.div>

        {/* Desktop Actions */}
        <motion.div
          className="hidden md:flex items-center space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: animationsEnabled ? 0.4 : 0 }}
        >
          {/* View Toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon={preferences.gridView ? <Grid /> : <List />}
            onClick={toggleViewMode}
            className="relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-primary-100 rounded-xl"
              initial={{ scale: 0 }}
              animate={{ scale: preferences.gridView ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <span className="relative z-10">
              {preferences.gridView ? 'Grid' : 'List'}
            </span>
          </Button>

          {/* Filters */}
          <Button
            variant="ghost"
            size="sm"
            icon={<Filter />}
            onClick={openFilters}
          >
            Filters
          </Button>

          {/* Animation Toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon={preferences.animationsEnabled ? <Sparkles /> : <Settings />}
            onClick={toggleAnimations}
            className={clsx({
              'animate-pulse': preferences.animationsEnabled
            })}
          >
            <span className="hidden lg:inline">
              {preferences.animationsEnabled ? 'Animated' : 'Static'}
            </span>
          </Button>

          {/* Theme Toggle (for future dark mode) */}
          <Button
            variant="ghost"
            size="sm"
            icon={preferences.theme === 'light' ? <Moon /> : <Sun />}
            onClick={toggleTheme}
          >
            <span className="hidden lg:inline">
              {preferences.theme === 'light' ? 'Dark' : 'Light'}
            </span>
          </Button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
          whileTap={{ scale: animationsEnabled ? 0.95 : 1 }}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: animationsEnabled ? 0.2 : 0 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: animationsEnabled ? 0.2 : 0 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-white/20"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: animationsEnabled ? 0.3 : 0 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <SearchBar
                placeholder="Search products..."
                fullWidth
                size="sm"
              />

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={preferences.gridView ? <Grid /> : <List />}
                  onClick={toggleViewMode}
                >
                  {preferences.gridView ? 'Grid View' : 'List View'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Filter />}
                  onClick={openFilters}
                >
                  Filters
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={preferences.animationsEnabled ? <Sparkles /> : <Settings />}
                  onClick={toggleAnimations}
                >
                  {preferences.animationsEnabled ? 'Animated' : 'Static'}
                </Button>
              </div>

              {/* Stats */}
              {computed.hasProducts && (
                <motion.div
                  className="text-center text-sm text-secondary-600 pt-2 border-t border-secondary-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: animationsEnabled ? 0.2 : 0 }}
                >
                  Showing {computed.filteredProductsCount} products
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
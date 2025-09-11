// Header.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Menu, X, User, Store } from 'lucide-react';
import SearchBar from '../filters/SearchBar';
import Button from '../ui/Button';
import { useScrollDirection } from '../../hooks/useScrollDirection';

const Header = ({ 
  onSearch,
  cartItems = 0,
  favoriteItems = 0,
  searchValue = '',
  searchLoading = false 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { scrollDirection, scrollY } = useScrollDirection();

  // Hide header on scroll down, show on scroll up
  const shouldHideHeader = scrollDirection === 'down' && scrollY > 100;

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hidden: {
      y: -100,
      opacity: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        animate={shouldHideHeader ? "hidden" : "visible"}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              className="flex items-center space-x-2"
            >
              <div className="p-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">
                  ProductHub
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Discover Amazing Products</p>
              </div>
            </motion.div>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-xl mx-8">
              <SearchBar
                value={searchValue}
                onSearch={onSearch}
                loading={searchLoading}
                placeholder="Search thousands of products..."
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSearchOpen(true)}
                className="lg:hidden"
              >
                <Search size={20} />
              </Button>

              <motion.div className="relative">
                <Button variant="ghost" size="sm">
                  <Heart size={20} />
                  {favoriteItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {favoriteItems > 99 ? '99+' : favoriteItems}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              <motion.div className="relative">
                <Button variant="ghost" size="sm">
                  <ShoppingCart size={20} />
                  {cartItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartItems > 99 ? '99+' : cartItems}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              <Button variant="ghost" size="sm">
                <User size={20} />
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden"
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          >
            <div className="bg-white p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <SearchBar
                    value={searchValue}
                    onSearch={onSearch}
                    loading={searchLoading}
                    placeholder="Search products..."
                    size="lg"
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <X size={24} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X size={24} />
                  </Button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-200">
                  <SearchBar
                    value={searchValue}
                    onSearch={onSearch}
                    loading={searchLoading}
                    placeholder="Search products..."
                  />
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-4">
                  <motion.div
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Heart size={20} className="text-gray-600" />
                      <span className="font-medium">Favorites</span>
                    </div>
                    {favoriteItems > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {favoriteItems}
                      </span>
                    )}
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingCart size={20} className="text-gray-600" />
                      <span className="font-medium">Cart</span>
                    </div>
                    {cartItems > 0 && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        {cartItems}
                      </span>
                    )}
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User size={20} className="text-gray-600" />
                    <span className="font-medium">Account</span>
                  </motion.div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    © 2024 ProductHub. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;


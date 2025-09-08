import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { useAppContext } from '@contexts/AppContext';
import { useAnimation } from '@hooks/useAnimation';
import Loading from '@components/common/Loading';

const Layout = ({ children }) => {
  const { isInitialized, loading, preferences } = useAppContext();
  const { animationsEnabled } = useAnimation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Loading 
          type="spinner" 
          message="Initializing ProductHub..." 
          size="lg" 
          color="primary"
        />
      </div>
    );
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationsEnabled ? 0.5 : 0,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: animationsEnabled ? 0.3 : 0,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${
      preferences.theme === 'dark' ? 'dark' : ''
    }`}>
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <motion.main
        className="relative"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Page Content */}
        <div className="pt-16 sm:pt-18 lg:pt-20 min-h-screen">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Footer */}
      <Footer />

      {/* Background Effects */}
      {animationsEnabled && (
        <>
          {/* Floating Particles */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-200/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Gradient Orbs */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-accent-400/20 to-primary-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
                opacity: [0.2, 0.1, 0.2]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading === 'loading' && (
          <motion.div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationsEnabled ? 0.2 : 0 }}
          >
            <Loading 
              type="spinner" 
              message="Loading..." 
              size="lg" 
              color="primary"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
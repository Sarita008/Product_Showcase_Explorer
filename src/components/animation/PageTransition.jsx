import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAnimation } from '@hooks/useAnimation';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const { animationsEnabled } = useAnimation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 20,
    },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: animationsEnabled ? 0.4 : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: animationsEnabled ? 0.1 : 0,
        delayChildren: animationsEnabled ? 0.1 : 0,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: animationsEnabled ? 0.3 : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const overlayVariants = {
    initial: {
      scaleY: 1,
    },
    animate: {
      scaleY: 0,
      transition: {
        duration: animationsEnabled ? 0.6 : 0,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="relative min-h-screen"
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {/* Page transition overlay */}
        {animationsEnabled && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-primary-600 to-primary-800 z-50 origin-top"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            style={{ transformOrigin: 'top' }}
          />
        )}
        
        {/* Page content */}
        <motion.div
          className="relative z-10"
          variants={{
            enter: {
              transition: {
                staggerChildren: animationsEnabled ? 0.1 : 0,
                delayChildren: animationsEnabled ? 0.2 : 0,
              },
            },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
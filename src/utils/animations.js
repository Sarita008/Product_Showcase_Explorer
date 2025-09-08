// Animation utility functions and configurations

/**
 * Common animation variants for consistent motion design
 */

// Page transition variants
export const pageVariants = {
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
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade in variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Slide up variants
export const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide down variants
export const slideDownVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide left variants
export const slideLeftVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide right variants
export const slideRightVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Scale variants
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Card variants
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Stagger container variants
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item variants
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Modal variants
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Overlay variants
export const overlayVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Drawer variants
export const drawerVariants = {
  hidden: (direction = 'right') => ({
    x: direction === 'right' ? '100%' : direction === 'left' ? '-100%' : 0,
    y: direction === 'top' ? '-100%' : direction === 'bottom' ? '100%' : 0,
    transition: { duration: 0.3 },
  }),
  visible: {
    x: 0,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
};

// Button variants
export const buttonVariants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 },
};

// Loading spinner variants
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Animation presets for common use cases
 */
export const animationPresets = {
  // Gentle entrance animation
  gentle: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },

  // Bouncy entrance animation
  bouncy: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },

  // Slide from bottom
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Fade and scale
  fadeScale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // Rotate in
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/**
 * Easing functions
 */
export const easings = {
  // Custom cubic bezier easings
  smooth: [0.25, 0.46, 0.45, 0.94],
  snappy: [0.68, -0.55, 0.265, 1.55],
  gentle: [0.25, 0.1, 0.25, 1],
  
  // Spring configurations
  spring: {
    gentle: { type: "spring", stiffness: 100, damping: 15 },
    snappy: { type: "spring", stiffness: 400, damping: 25 },
    bouncy: { type: "spring", stiffness: 300, damping: 10 },
  },
};

/**
 * Animation duration constants
 */
export const durations = {
  instant: 0,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
};

/**
 * Utility functions
 */

/**
 * Creates stagger animations for child elements
 */
export const createStagger = (delay = 0.1, delayChildren = 0) => ({
  visible: {
    transition: {
      staggerChildren: delay,
      delayChildren,
    },
  },
});

/**
 * Creates a custom variant with the given parameters
 */
export const createVariant = ({ 
  hidden = {}, 
  visible = {}, 
  transition = {},
  hover = {},
  tap = {} 
}) => ({
  hidden,
  visible: { ...visible, transition },
  ...(Object.keys(hover).length > 0 && { hover }),
  ...(Object.keys(tap).length > 0 && { tap }),
});

/**
 * Creates responsive animation variants
 */
export const createResponsiveVariant = ({ 
  mobile = {}, 
  tablet = {}, 
  desktop = {} 
}) => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  if (isMobile && Object.keys(mobile).length > 0) return mobile;
  if (isTablet && Object.keys(tablet).length > 0) return tablet;
  return desktop;
};

/**
 * Animation hooks utilities
 */

/**
 * Creates a reusable animation configuration
 */
export const useAnimationConfig = (enabled = true) => {
  const getVariant = (variant) => {
    if (!enabled) {
      return {
        ...variant,
        transition: { duration: 0 },
      };
    }
    return variant;
  };

  const getTransition = (transition) => {
    if (!enabled) {
      return { duration: 0 };
    }
    return transition;
  };

  return { getVariant, getTransition, enabled };
};

/**
 * Performance optimization utilities
 */

/**
 * Reduces motion for users who prefer reduced motion
 */
export const respectReducedMotion = (variants) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    const reducedVariants = {};
    Object.keys(variants).forEach(key => {
      if (variants[key].transition) {
        reducedVariants[key] = {
          ...variants[key],
          transition: { duration: 0 },
        };
      } else {
        reducedVariants[key] = variants[key];
      }
    });
    return reducedVariants;
  }
  
  return variants;
};

/**
 * Common animation combinations
 */
export const animations = {
  // Page transitions
  pageTransition: respectReducedMotion(pageVariants),
  
  // Component entrances
  fadeIn: respectReducedMotion(fadeInVariants),
  slideUp: respectReducedMotion(slideUpVariants),
  slideDown: respectReducedMotion(slideDownVariants),
  slideLeft: respectReducedMotion(slideLeftVariants),
  slideRight: respectReducedMotion(slideRightVariants),
  scale: respectReducedMotion(scaleVariants),
  
  // Interactive elements
  card: respectReducedMotion(cardVariants),
  button: respectReducedMotion(buttonVariants),
  
  // Layout animations
  staggerContainer: respectReducedMotion(staggerContainerVariants),
  staggerItem: respectReducedMotion(staggerItemVariants),
  
  // Modals and overlays
  modal: respectReducedMotion(modalVariants),
  overlay: respectReducedMotion(overlayVariants),
  drawer: respectReducedMotion(drawerVariants),
};

export default animations;
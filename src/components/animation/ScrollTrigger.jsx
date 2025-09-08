import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useAnimation as useAppAnimation } from '@hooks/useAnimation';

const ScrollTrigger = ({ 
  children, 
  threshold = 0.1,
  triggerOnce = true,
  direction = 'up', // 'up', 'down', 'left', 'right', 'fade', 'scale'
  delay = 0,
  duration = 0.6,
  className = '',
  staggerChildren = false,
  staggerDelay = 0.1
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { 
    threshold, 
    once: triggerOnce,
    margin: '0px 0px -100px 0px'
  });
  const { animationsEnabled } = useAppAnimation();

  // Animation variants based on direction
  const getVariants = () => {
    const baseTransition = {
      duration: animationsEnabled ? duration : 0,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: animationsEnabled ? delay : 0,
    };

    const staggerTransition = {
      ...baseTransition,
      staggerChildren: animationsEnabled && staggerChildren ? staggerDelay : 0,
    };

    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 60 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: staggerChildren ? staggerTransition : baseTransition 
          },
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -60 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: staggerChildren ? staggerTransition : baseTransition 
          },
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: 60 },
          visible: { 
            opacity: 1, 
            x: 0, 
            transition: staggerChildren ? staggerTransition : baseTransition 
          },
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -60 },
          visible: { 
            opacity: 1, 
            x: 0, 
            transition: staggerChildren ? staggerTransition : baseTransition 
          },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            transition: staggerChildren ? staggerTransition : baseTransition 
          },
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: staggerChildren ? staggerTransition : baseTransition 
          },
        };
    }
  };

  const variants = getVariants();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, triggerOnce]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

// Higher-order component for easier use
export const withScrollTrigger = (Component, options = {}) => {
  return React.forwardRef((props, ref) => (
    <ScrollTrigger {...options}>
      <Component {...props} ref={ref} />
    </ScrollTrigger>
  ));
};

// Stagger container component
export const StaggerContainer = ({ children, className = '', ...props }) => {
  return (
    <ScrollTrigger 
      className={className} 
      staggerChildren={true} 
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {child}
        </motion.div>
      ))}
    </ScrollTrigger>
  );
};

export default ScrollTrigger;
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '@hooks/useAnimation';

const FadeInStagger = ({
  children,
  className = '',
  staggerDelay = 0.1,
  duration = 0.5,
  direction = 'up',
  distance = 30,
  once = true,
  threshold = 0.1
}) => {
  const { animationsEnabled, useScrollAnimation } = useAnimation();
  const { ref, inView } = useScrollAnimation({ 
    threshold,
    triggerOnce: once
  });

  // Direction variants
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animationsEnabled ? staggerDelay : 0,
        delayChildren: animationsEnabled ? 0.1 : 0
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...getDirectionOffset()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: animationsEnabled ? duration : 0,
        ease: "easeOut"
      }
    }
  };

  // If animations are disabled, render normally
  if (!animationsEnabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FadeInStagger;
import { useCallback, useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppContext } from '@contexts/AppContext';
import { ANIMATION_DURATION } from '@utils/constants';

export const useAnimation = () => {
  const { preferences } = useAppContext();
  const animationsEnabled = preferences.animationsEnabled;

  // Intersection Observer hook for scroll animations
  const useScrollAnimation = (options = {}) => {
    const { ref, inView } = useInView({
      threshold: 0.1,
      triggerOnce: true,
      ...options
    });

    return { ref, inView, animationsEnabled };
  };

  // Stagger animation hook
  const useStaggerAnimation = (itemCount, delay = 0.1) => {
    const [visibleItems, setVisibleItems] = useState(0);
    const { ref, inView } = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    useEffect(() => {
      if (inView && animationsEnabled) {
        const timer = setInterval(() => {
          setVisibleItems(prev => {
            if (prev < itemCount) {
              return prev + 1;
            } else {
              clearInterval(timer);
              return prev;
            }
          });
        }, delay * 1000);

        return () => clearInterval(timer);
      } else if (inView) {
        // If animations are disabled, show all items immediately
        setVisibleItems(itemCount);
      }
    }, [inView, itemCount, delay, animationsEnabled]);

    return { ref, visibleItems, inView };
  };

  // Hover animation state
  const useHoverAnimation = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => {
      if (animationsEnabled) {
        setIsHovered(true);
      }
    }, [animationsEnabled]);

    const handleMouseLeave = useCallback(() => {
      if (animationsEnabled) {
        setIsHovered(false);
      }
    }, [animationsEnabled]);

    return {
      isHovered,
      handleMouseEnter,
      handleMouseLeave,
      hoverProps: animationsEnabled ? {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      } : {}
    };
  };

  // Page transition animation
  const usePageTransition = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);

    const startTransition = useCallback(() => {
      if (animationsEnabled) {
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 500);
      }
    }, [animationsEnabled]);

    return { isTransitioning, startTransition };
  };

  // Modal animation
  const useModalAnimation = (isOpen) => {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
      } else if (animationsEnabled) {
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, ANIMATION_DURATION.NORMAL * 1000);
        return () => clearTimeout(timer);
      } else {
        setShouldRender(false);
      }
    }, [isOpen, animationsEnabled]);

    return { shouldRender };
  };

  // Loading animation
  const useLoadingAnimation = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      if (!animationsEnabled) return;

      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(interval);
    }, [animationsEnabled]);

    return { dots };
  };

  // Pulse animation for notifications
  const usePulseAnimation = (trigger) => {
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
      if (trigger && animationsEnabled) {
        setIsPulsing(true);
        const timer = setTimeout(() => setIsPulsing(false), 1000);
        return () => clearTimeout(timer);
      }
    }, [trigger, animationsEnabled]);

    return { isPulsing };
  };

  // Shake animation for errors
  const useShakeAnimation = (trigger) => {
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
      if (trigger && animationsEnabled) {
        setIsShaking(true);
        const timer = setTimeout(() => setIsShaking(false), 600);
        return () => clearTimeout(timer);
      }
    }, [trigger, animationsEnabled]);

    return { isShaking };
  };

  // Typewriter effect
  const useTypewriter = (text, speed = 50) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      if (!animationsEnabled) {
        setDisplayText(text);
        return;
      }

      setIsTyping(true);
      setDisplayText('');
      let index = 0;

      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(prev => prev + text.charAt(index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }, [text, speed, animationsEnabled]);

    return { displayText, isTyping };
  };

  // Counter animation
  const useCounterAnimation = (end, start = 0, duration = 2000) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
      if (!animationsEnabled) {
        setCount(end);
        return;
      }

      const increment = (end - start) / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [end, start, duration, animationsEnabled]);

    return { count };
  };

  // Animation variants for Framer Motion
  const getAnimationVariants = () => ({
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: animationsEnabled ? ANIMATION_DURATION.NORMAL : 0 }
      }
    },
    slideIn: {
      hidden: { opacity: 0, x: -30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: animationsEnabled ? ANIMATION_DURATION.NORMAL : 0 }
      }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: animationsEnabled ? ANIMATION_DURATION.FAST : 0 }
      }
    },
    stagger: {
      visible: {
        transition: {
          staggerChildren: animationsEnabled ? 0.1 : 0
        }
      }
    },
    bounce: {
      animate: animationsEnabled ? {
        y: [0, -10, 0],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }
      } : {}
    },
    float: {
      animate: animationsEnabled ? {
        y: [0, -5, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}
    },
    glow: {
      animate: animationsEnabled ? {
        boxShadow: [
          "0 0 20px rgba(59, 130, 246, 0.3)",
          "0 0 30px rgba(59, 130, 246, 0.6)",
          "0 0 20px rgba(59, 130, 246, 0.3)"
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}
    }
  });

  return {
    animationsEnabled,
    useScrollAnimation,
    useStaggerAnimation,
    useHoverAnimation,
    usePageTransition,
    useModalAnimation,
    useLoadingAnimation,
    usePulseAnimation,
    useShakeAnimation,
    useTypewriter,
    useCounterAnimation,
    getAnimationVariants
  };
};

export default useAnimation;
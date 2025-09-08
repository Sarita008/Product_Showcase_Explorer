import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Package, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';
import { useAnimation } from '@hooks/useAnimation';

const Loading = ({
  type = 'spinner',
  size = 'md',
  message = 'Loading...',
  showMessage = true,
  fullScreen = false,
  overlay = false,
  className = '',
  color = 'primary'
}) => {
  const { animationsEnabled, useLoadingAnimation } = useAnimation();
  const { dots } = useLoadingAnimation();

  // Size configurations
  const sizeConfig = {
    xs: { spinner: 16, skeleton: 'h-4', text: 'text-xs' },
    sm: { spinner: 20, skeleton: 'h-6', text: 'text-sm' },
    md: { spinner: 24, skeleton: 'h-8', text: 'text-base' },
    lg: { spinner: 32, skeleton: 'h-12', text: 'text-lg' },
    xl: { spinner: 40, skeleton: 'h-16', text: 'text-xl' }
  };

  // Color configurations
  const colorConfig = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    white: 'text-white'
  };

  const baseClasses = clsx(
    'flex flex-col items-center justify-center',
    {
      'fixed inset-0 z-50': fullScreen,
      'absolute inset-0': overlay && !fullScreen
    },
    className
  );

  const overlayClasses = clsx({
    'bg-white/80 backdrop-blur-sm': overlay || fullScreen,
    'bg-black/20': overlay && color === 'white'
  });

  // Spinner Loading
  const SpinnerLoading = () => (
    <motion.div
      className={clsx('flex flex-col items-center space-y-3')}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: animationsEnabled ? 0.3 : 0 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Loader2 
          size={sizeConfig[size].spinner} 
          className={colorConfig[color]} 
        />
      </motion.div>
      {showMessage && (
        <motion.p
          className={clsx(
            sizeConfig[size].text,
            colorConfig[color],
            'font-medium'
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: animationsEnabled ? 0.3 : 0 }}
        >
          {message}{animationsEnabled ? dots : ''}
        </motion.p>
      )}
    </motion.div>
  );

  // Pulse Loading
  const PulseLoading = () => (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={clsx(
              'w-3 h-3 rounded-full',
              color === 'white' ? 'bg-white' : 'bg-primary-500'
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      {showMessage && (
        <p className={clsx(
          sizeConfig[size].text,
          colorConfig[color],
          'font-medium'
        )}>
          {message}
        </p>
      )}
    </div>
  );

  // Skeleton Loading
  const SkeletonLoading = ({ lines = 3 }) => (
    <div className="space-y-3 w-full max-w-sm">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={clsx(
            'bg-secondary-200 rounded-lg shimmer-bg',
            sizeConfig[size].skeleton,
            i === lines - 1 && 'w-3/4' // Last line shorter
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1, duration: animationsEnabled ? 0.3 : 0 }}
        />
      ))}
    </div>
  );

  // Product Card Skeleton
  const ProductCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 shadow-card space-y-4">
      <motion.div
        className="h-48 bg-secondary-200 rounded-xl shimmer-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationsEnabled ? 0.3 : 0 }}
      />
      <div className="space-y-2">
        <motion.div
          className="h-4 bg-secondary-200 rounded shimmer-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: animationsEnabled ? 0.3 : 0 }}
        />
        <motion.div
          className="h-4 bg-secondary-200 rounded shimmer-bg w-3/4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: animationsEnabled ? 0.3 : 0 }}
        />
        <motion.div
          className="h-6 bg-secondary-200 rounded shimmer-bg w-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: animationsEnabled ? 0.3 : 0 }}
        />
      </div>
    </div>
  );

  // Custom Icon Loading
  const IconLoading = ({ icon: Icon = Package }) => (
    <motion.div
      className="flex flex-col items-center space-y-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: animationsEnabled ? 0.3 : 0 }}
    >
      <motion.div
        animate={animationsEnabled ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Icon 
          size={sizeConfig[size].spinner} 
          className={colorConfig[color]} 
        />
      </motion.div>
      {showMessage && (
        <p className={clsx(
          sizeConfig[size].text,
          colorConfig[color],
          'font-medium'
        )}>
          {message}
        </p>
      )}
    </motion.div>
  );

  // Bounce Loading
  const BounceLoading = () => (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={clsx(
              'w-2 h-8 rounded-full',
              color === 'white' ? 'bg-white' : 'bg-primary-500'
            )}
            animate={{
              scaleY: [1, 2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      {showMessage && (
        <p className={clsx(
          sizeConfig[size].text,
          colorConfig[color],
          'font-medium'
        )}>
          {message}
        </p>
      )}
    </div>
  );

  const renderLoading = () => {
    switch (type) {
      case 'spinner':
        return <SpinnerLoading />;
      case 'pulse':
        return <PulseLoading />;
      case 'skeleton':
        return <SkeletonLoading />;
      case 'product-skeleton':
        return <ProductCardSkeleton />;
      case 'bounce':
        return <BounceLoading />;
      case 'package':
        return <IconLoading icon={Package} />;
      case 'shopping':
        return <IconLoading icon={ShoppingBag} />;
      default:
        return <SpinnerLoading />;
    }
  };

  return (
    <div className={clsx(baseClasses, overlayClasses)}>
      {renderLoading()}
    </div>
  );
};

// Preset loading components
export const SpinnerLoader = (props) => <Loading type="spinner" {...props} />;
export const PulseLoader = (props) => <Loading type="pulse" {...props} />;
export const SkeletonLoader = (props) => <Loading type="skeleton" {...props} />;
export const ProductSkeleton = (props) => <Loading type="product-skeleton" {...props} />;
export const BounceLoader = (props) => <Loading type="bounce" {...props} />;
export const FullScreenLoader = (props) => <Loading fullScreen overlay {...props} />;

export default Loading;
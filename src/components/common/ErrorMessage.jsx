import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Home,
  Wifi,
  Server
} from 'lucide-react';
import clsx from 'clsx';
import Button from './Button';
import { useAnimation } from '@hooks/useAnimation';

const ErrorMessage = ({
  type = 'error',
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  showIcon = true,
  showRetry = true,
  showHome = false,
  onRetry = null,
  onHome = null,
  className = '',
  size = 'md',
  fullHeight = false,
  inline = false
}) => {
  const { animationsEnabled, useShakeAnimation } = useAnimation();
  const { isShaking } = useShakeAnimation(true);

  // Error type configurations
  const errorConfig = {
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-600'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-600'
    },
    info: {
      icon: AlertCircle,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-600'
    },
    network: {
      icon: Wifi,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-600'
    },
    server: {
      icon: Server,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-600'
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'p-4',
      icon: 20,
      title: 'text-sm font-semibold',
      message: 'text-xs',
      button: 'sm'
    },
    md: {
      container: 'p-6',
      icon: 24,
      title: 'text-lg font-semibold',
      message: 'text-sm',
      button: 'md'
    },
    lg: {
      container: 'p-8',
      icon: 32,
      title: 'text-xl font-semibold',
      message: 'text-base',
      button: 'lg'
    }
  };

  const config = errorConfig[type];
  const sizeConf = sizeConfig[size];
  const IconComponent = config.icon;

  const containerClasses = clsx(
    'rounded-2xl border',
    config.bgColor,
    config.borderColor,
    sizeConf.container,
    {
      'flex flex-col items-center justify-center min-h-[400px]': fullHeight && !inline,
      'flex items-start space-x-3': inline,
      'text-center': !inline,
      'w-full max-w-md mx-auto': !inline && !fullHeight
    },
    className
  );

  const animationVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: animationsEnabled ? 0.3 : 0 }
    },
    shake: {
      x: isShaking && animationsEnabled ? [-10, 10, -10, 10, 0] : 0,
      transition: { duration: 0.6 }
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default retry behavior - reload page
      window.location.reload();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      // Default home behavior
      window.location.href = '/';
    }
  };

  return (
    <motion.div
      className={containerClasses}
      variants={animationVariants}
      initial="hidden"
      animate={["visible", "shake"]}
    >
      {/* Icon */}
      {showIcon && (
        <motion.div
          className={clsx('mb-4', { 'mb-0 flex-shrink-0': inline })}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: animationsEnabled ? 0.1 : 0,
            type: "spring",
            stiffness: 200,
            damping: 10
          }}
        >
          <IconComponent 
            size={sizeConf.icon} 
            className={config.iconColor}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className={clsx({ 'flex-1': inline })}>
        <motion.h3
          className={clsx(sizeConf.title, config.titleColor, 'mb-2')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: animationsEnabled ? 0.2 : 0,
            duration: animationsEnabled ? 0.3 : 0
          }}
        >
          {title}
        </motion.h3>

        <motion.p
          className={clsx(sizeConf.message, config.messageColor, 'mb-4')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: animationsEnabled ? 0.3 : 0,
            duration: animationsEnabled ? 0.3 : 0
          }}
        >
          {message}
        </motion.p>

        {/* Action Buttons */}
        {(showRetry || showHome) && (
          <motion.div
            className={clsx(
              'flex gap-3',
              {
                'justify-center': !inline,
                'justify-start': inline
              }
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: animationsEnabled ? 0.4 : 0,
              duration: animationsEnabled ? 0.3 : 0
            }}
          >
            {showRetry && (
              <Button
                variant="outline"
                size={sizeConf.button}
                icon={<RefreshCw />}
                onClick={handleRetry}
              >
                Try Again
              </Button>
            )}

            {showHome && (
              <Button
                variant="secondary"
                size={sizeConf.button}
                icon={<Home />}
                onClick={handleHome}
              >
                Go Home
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Preset error components
export const NetworkError = (props) => (
  <ErrorMessage
    type="network"
    title="Connection Error"
    message="Please check your internet connection and try again."
    {...props}
  />
);

export const ServerError = (props) => (
  <ErrorMessage
    type="server"
    title="Server Error"
    message="Our servers are experiencing issues. Please try again later."
    {...props}
  />
);

export const NotFoundError = (props) => (
  <ErrorMessage
    type="warning"
    title="Not Found"
    message="The page or resource you're looking for doesn't exist."
    showHome={true}
    {...props}
  />
);

export const ValidationError = (props) => (
  <ErrorMessage
    type="warning"
    title="Validation Error"
    message="Please check your input and try again."
    showRetry={false}
    {...props}
  />
);

export const GenericError = (props) => (
  <ErrorMessage
    type="error"
    title="Oops! Something went wrong"
    message="An unexpected error occurred. Our team has been notified."
    {...props}
  />
);

export default ErrorMessage;
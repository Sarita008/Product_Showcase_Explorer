import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAnimation } from '@hooks/useAnimation';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const { animationsEnabled, getAnimationVariants } = useAnimation();

  // Base button styles
  const baseStyles = clsx(
    'inline-flex items-center justify-center font-medium rounded-xl',
    'transition-all duration-300 ease-out transform',
    'focus:outline-none focus:ring-4',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    {
      'w-full': fullWidth,
      'cursor-not-allowed': disabled || loading
    }
  );

  // Variant styles
  const variantStyles = {
    primary: clsx(
      'bg-gradient-to-r from-primary-500 to-primary-600',
      'hover:from-primary-600 hover:to-primary-700',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-primary-200',
      !disabled && !loading && 'hover:scale-105'
    ),
    secondary: clsx(
      'bg-white hover:bg-secondary-50',
      'text-secondary-700 border border-secondary-200',
      'hover:border-secondary-300 shadow-sm hover:shadow-md',
      'focus:ring-secondary-200',
      !disabled && !loading && 'hover:scale-105'
    ),
    accent: clsx(
      'bg-gradient-to-r from-accent-500 to-accent-600',
      'hover:from-accent-600 hover:to-accent-700',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-accent-200',
      !disabled && !loading && 'hover:scale-105'
    ),
    ghost: clsx(
      'bg-transparent hover:bg-secondary-100',
      'text-secondary-700 hover:text-secondary-900',
      'focus:ring-secondary-200',
      !disabled && !loading && 'hover:scale-105'
    ),
    danger: clsx(
      'bg-gradient-to-r from-red-500 to-red-600',
      'hover:from-red-600 hover:to-red-700',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-red-200',
      !disabled && !loading && 'hover:scale-105'
    ),
    success: clsx(
      'bg-gradient-to-r from-green-500 to-green-600',
      'hover:from-green-600 hover:to-green-700',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-green-200',
      !disabled && !loading && 'hover:scale-105'
    ),
    outline: clsx(
      'bg-transparent border-2 border-primary-500',
      'text-primary-600 hover:bg-primary-500 hover:text-white',
      'focus:ring-primary-200',
      !disabled && !loading && 'hover:scale-105'
    ),
    glow: clsx(
      'bg-gradient-to-r from-primary-500 to-primary-600',
      'text-white shadow-glow hover:shadow-glow-lg',
      'focus:ring-primary-200',
      !disabled && !loading && 'hover:scale-105 animate-glow'
    )
  };

  // Size styles
  const sizeStyles = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // Icon size mapping
  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  const buttonClasses = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const renderIcon = (iconElement, position) => {
    if (!iconElement) return null;
    
    const iconClass = clsx({
      'mr-2': position === 'left',
      'ml-2': position === 'right'
    });

    return (
      <span className={iconClass}>
        {React.isValidElement(iconElement) 
          ? React.cloneElement(iconElement, { size: iconSizes[size] })
          : iconElement
        }
      </span>
    );
  };

  const buttonContent = (
    <>
      {loading && (
        <motion.div
          className="mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={iconSizes[size]} />
        </motion.div>
      )}
      
      {!loading && iconPosition === 'left' && renderIcon(icon, 'left')}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {!loading && iconPosition === 'right' && renderIcon(icon, 'right')}
    </>
  );

  const MotionButton = motion.button;

  const buttonProps = {
    className: buttonClasses,
    disabled: disabled || loading,
    type,
    onClick: disabled || loading ? undefined : onClick,
    ...props
  };

  if (animationsEnabled) {
    return (
      <MotionButton
        {...buttonProps}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        whileHover={{ 
          scale: disabled || loading ? 1 : 1.02,
          transition: { duration: 0.2 }
        }}
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {buttonContent}
      </MotionButton>
    );
  }

  return (
    <button {...buttonProps}>
      {buttonContent}
    </button>
  );
};

// Preset button components for common use cases
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const AccentButton = (props) => <Button variant="accent" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GlowButton = (props) => <Button variant="glow" {...props} />;

export default Button;
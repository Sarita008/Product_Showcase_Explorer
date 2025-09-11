
// Card.jsx
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import clsx from 'clsx';

const Card = forwardRef(({ 
  children, 
  variant = 'default',
  hover = true,
  className,
  onClick,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white rounded-lg border transition-all duration-200';
  
  const variants = {
    default: 'border-gray-200 shadow-sm',
    elevated: 'border-gray-200 shadow-md',
    outlined: 'border-gray-300 shadow-none',
    ghost: 'border-transparent shadow-none bg-transparent',
  };

  const hoverClasses = hover ? 'hover:shadow-medium hover:-translate-y-1 cursor-pointer' : '';

  return (
    <motion.div
      ref={ref}
      className={clsx(baseClasses, variants[variant], hoverClasses, className)}
      onClick={onClick}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Card subcomponents
export const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4 border-t border-gray-200', className)} {...props}>
    {children}
  </div>
);

export default Card;
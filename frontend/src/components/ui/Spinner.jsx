
// Spinner.jsx
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Spinner = ({ size = 'md', color = 'primary', className }) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    success: 'text-green-600',
    danger: 'text-red-600',
  };

  return (
    <motion.svg
      className={clsx('animate-spin', sizes[size], colors[color], className)}
      fill="none"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );
};

// LoadingSpinner component for full page loading
export const LoadingSpinner = ({ text = "Loading...", className }) => (
  <div className={clsx('flex flex-col items-center justify-center p-8', className)}>
    <Spinner size="xl" />
    <p className="mt-4 text-gray-600 text-sm">{text}</p>
  </div>
);

// InlineSpinner for inline loading states
export const InlineSpinner = ({ size = 'sm', className }) => (
  <Spinner size={size} className={clsx('inline-block', className)} />
);

export default Spinner;
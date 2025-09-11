import { motion } from 'framer-motion';
import clsx from 'clsx';

const SkeletonLoader = ({ className, width, height }) => {
  return (
    <motion.div
      className={clsx(
        'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded',
        className
      )}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <motion.div
    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Image skeleton */}
    <SkeletonLoader className="w-full h-48" />
    
    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <SkeletonLoader className="h-4 w-3/4" />
      
      {/* Price */}
      <SkeletonLoader className="h-5 w-1/3" />
      
      {/* Rating */}
      <div className="flex items-center space-x-1">
        <SkeletonLoader className="h-4 w-4 rounded" />
        <SkeletonLoader className="h-3 w-12" />
      </div>
      
      {/* Button */}
      <SkeletonLoader className="h-10 w-full" />
    </div>
  </motion.div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Product Detail Skeleton
export const ProductDetailSkeleton = () => (
  <motion.div
    className="p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Images skeleton */}
      <div className="space-y-4">
        <SkeletonLoader className="w-full h-80 rounded-lg" />
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} className="w-16 h-16 rounded" />
          ))}
        </div>
      </div>
      
      {/* Details skeleton */}
      <div className="space-y-4">
        {/* Title */}
        <SkeletonLoader className="h-8 w-full" />
        <SkeletonLoader className="h-6 w-3/4" />
        
        {/* Price */}
        <div className="flex items-center space-x-4">
          <SkeletonLoader className="h-8 w-24" />
          <SkeletonLoader className="h-6 w-20" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-5 w-5 rounded" />
            ))}
          </div>
          <SkeletonLoader className="h-4 w-16" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-2/3" />
        </div>
        
        {/* Specs */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <SkeletonLoader className="h-4 w-1/3" />
              <SkeletonLoader className="h-4 w-1/4" />
            </div>
          ))}
        </div>
        
        {/* Button */}
        <SkeletonLoader className="h-12 w-full" />
      </div>
    </div>
  </motion.div>
);

// Header Skeleton
export const HeaderSkeleton = () => (
  <div className="bg-white border-b border-gray-200">
    <div className="container-custom py-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-8 w-32" />
        <div className="flex space-x-4">
          <SkeletonLoader className="h-10 w-64" />
          <SkeletonLoader className="h-10 w-24" />
        </div>
      </div>
    </div>
  </div>
);

// Filter Skeleton
export const FilterSkeleton = () => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="space-y-4">
      {/* Search */}
      <SkeletonLoader className="h-10 w-full" />
      
      {/* Categories */}
      <div className="space-y-2">
        <SkeletonLoader className="h-4 w-20" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-8 w-16" />
          ))}
        </div>
      </div>
      
      {/* Sort */}
      <div className="space-y-2">
        <SkeletonLoader className="h-4 w-16" />
        <SkeletonLoader className="h-10 w-full" />
      </div>
    </div>
  </div>
);

// Text skeleton for various text elements
export const TextSkeleton = ({ lines = 1, className }) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLoader
        key={i}
        className={clsx(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

// Image skeleton
export const ImageSkeleton = ({ className, aspectRatio = 'aspect-square' }) => (
  <SkeletonLoader
    className={clsx(
      'w-full rounded-lg',
      aspectRatio === 'aspect-square' && 'aspect-square',
      aspectRatio === 'aspect-video' && 'aspect-video',
      aspectRatio === 'aspect-[4/3]' && 'aspect-[4/3]',
      className
    )}
  />
);

export default SkeletonLoader;
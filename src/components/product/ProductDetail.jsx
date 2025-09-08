import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@contexts/AppContext';
import { useAnimation } from '@hooks/useAnimation';
import { 
  formatPrice, 
  formatRating, 
  formatDiscount, 
  calculateDiscountedPrice 
} from '@utils/helpers';
import Button from '@components/common/Button';
import ScrollTrigger from '@components/animation/ScrollTrigger';

const ProductDetail = ({ productId, product: initialProduct }) => {
  const [product, setProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(!initialProduct);
  
  const { animationsEnabled } = useAnimation();

  // Mock product data for demo
  useEffect(() => {
    if (!product && productId) {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setProduct({
          id: productId,
          title: "Premium Wireless Headphones",
          description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding.",
          price: 299.99,
          discountPercentage: 15,
          rating: 4.8,
          stock: 25,
          brand: "AudioTech",
          category: "Electronics",
          thumbnail: "/api/placeholder/600/600",
          images: [
            "/api/placeholder/600/600",
            "/api/placeholder/600/600",
            "/api/placeholder/600/600",
            "/api/placeholder/600/600"
          ],
          features: [
            "Active Noise Cancellation",
            "30-hour Battery Life",
            "Premium Comfort Padding",
            "Bluetooth 5.0 Connectivity",
            "Quick Charge Technology"
          ],
          specifications: {
            "Driver Size": "40mm",
            "Frequency Response": "20Hz - 20kHz",
            "Battery Life": "30 hours",
            "Charging Time": "2 hours",
            "Weight": "250g",
            "Connectivity": "Bluetooth 5.0, 3.5mm jack"
          }
        });
        setLoading(false);
      }, 1000);
    }
  }, [productId, product]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-secondary-200 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-secondary-200 rounded"></div>
              <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
              <div className="h-6 bg-secondary-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const originalPrice = product.price;
  const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', { product, quantity });
  };

  const handleImageChange = (index) => {
    setSelectedImage(index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animationsEnabled ? 0.2 : 0,
        delayChildren: animationsEnabled ? 0.1 : 0,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: animationsEnabled ? 0.6 : 0, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-secondary-50 rounded-2xl overflow-hidden">
            <motion.img
              key={selectedImage}
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: animationsEnabled ? 0.3 : 0 }}
            />
            
            {/* Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => handleImageChange(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handleImageChange(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <motion.div
                className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-full"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {formatDiscount(product.discountPercentage)} OFF
              </motion.div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={clsx(
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index 
                      ? "border-primary-500 ring-2 ring-primary-200" 
                      : "border-transparent hover:border-secondary-300"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wide">
                {product.brand}
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Share2 />}
                  onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Heart className={isFavorite ? 'fill-current text-red-500' : ''} />}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? 'text-red-500' : ''}
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={clsx(
                      i < Math.floor(product.rating) 
                        ? "text-yellow-400 fill-current" 
                        : "text-secondary-300"
                    )}
                  />
                ))}
                <span className="ml-2 text-secondary-700 font-medium">
                  {formatRating(product.rating)}
                </span>
              </div>
              <span className="text-secondary-500">
                ({Math.floor(Math.random() * 500 + 50)} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl font-bold text-secondary-900">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-secondary-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <ScrollTrigger direction="up" delay={0.2}>
            <p className="text-secondary-600 leading-relaxed">
              {product.description}
            </p>
          </ScrollTrigger>

          {/* Features */}
          {product.features && (
            <ScrollTrigger direction="up" delay={0.3}>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-secondary-600">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollTrigger>
          )}

          {/* Quantity and Actions */}
          <ScrollTrigger direction="up" delay={0.4}>
            <div className="border-t border-secondary-200 pt-6">
              <div className="flex items-center space-x-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-secondary-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-3 border-x border-secondary-300 min-w-[60px] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-sm text-secondary-500 mb-2">
                    Stock Available
                  </span>
                  <span className="text-lg font-semibold text-secondary-900">
                    {product.stock} units
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  Add to Cart - {formatPrice(discountedPrice * quantity)}
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </ScrollTrigger>

          {/* Guarantees */}
          <ScrollTrigger direction="up" delay={0.5}>
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-secondary-200">
              <div className="flex flex-col items-center text-center">
                <Truck className="text-primary-500 mb-2" size={24} />
                <span className="text-sm font-medium text-secondary-700">Free Shipping</span>
                <span className="text-xs text-secondary-500">Orders over $50</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="text-primary-500 mb-2" size={24} />
                <span className="text-sm font-medium text-secondary-700">2 Year Warranty</span>
                <span className="text-xs text-secondary-500">Full coverage</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="text-primary-500 mb-2" size={24} />
                <span className="text-sm font-medium text-secondary-700">30 Day Returns</span>
                <span className="text-xs text-secondary-500">No questions asked</span>
              </div>
            </div>
          </ScrollTrigger>
        </motion.div>
      </div>

      {/* Specifications */}
      {product.specifications && (
        <ScrollTrigger direction="up" delay={0.6} className="mt-16">
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-secondary-100 last:border-b-0">
                  <span className="font-medium text-secondary-700">{key}</span>
                  <span className="text-secondary-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollTrigger>
      )}
    </motion.div>
  );
};

export default ProductDetail;
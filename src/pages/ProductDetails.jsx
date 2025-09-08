import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, AlertCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '@contexts/AppContext';
import { useAnimation } from '@hooks/useAnimation';
import ProductDetail from '@components/product/ProductDetail';
import ProductGrid from '@components/product/ProductGrid';
import ScrollTrigger from '@components/animation/ScrollTrigger';
import Button from '@components/common/Button';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { animationsEnabled } = useAnimation();

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock product data
          const mockProduct = {
            id: parseInt(id),
            title: "Premium Wireless Headphones",
            description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding. These headphones are designed for audiophiles who demand the best in sound quality and comfort.",
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
              "Active Noise Cancellation Technology",
              "30-hour Extended Battery Life",
              "Premium Memory Foam Padding",
              "Bluetooth 5.0 Connectivity",
              "Quick Charge Technology (15 min = 3 hours)",
              "Multi-device Pairing",
              "Voice Assistant Integration",
              "Foldable Design for Travel"
            ],
            specifications: {
              "Driver Size": "40mm Dynamic Drivers",
              "Frequency Response": "20Hz - 20kHz",
              "Battery Life": "30 hours (ANC on), 40 hours (ANC off)",
              "Charging Time": "2 hours (full charge)",
              "Quick Charge": "15 minutes = 3 hours playback",
              "Weight": "250g",
              "Connectivity": "Bluetooth 5.0, 3.5mm jack",
              "Noise Cancellation": "Active, up to -30dB",
              "Microphone": "Built-in with CVC 8.0",
              "Controls": "Touch controls + Physical buttons",
              "Compatibility": "iOS, Android, Windows, Mac",
              "Warranty": "2 years international warranty"
            },
            reviews: {
              total: 847,
              average: 4.8,
              breakdown: {
                5: 698,
                4: 119,
                3: 23,
                2: 5,
                1: 2
              }
            }
          };

          // Mock related products
          const mockRelatedProducts = [
            {
              id: 2,
              title: "Wireless Earbuds Pro",
              description: "True wireless earbuds with premium sound quality",
              price: 199.99,
              discountPercentage: 10,
              rating: 4.6,
              stock: 30,
              brand: "AudioTech",
              category: "Electronics",
              thumbnail: "/api/placeholder/400/400"
            },
            {
              id: 3,
              title: "Bluetooth Speaker",
              description: "Portable speaker with powerful bass",
              price: 89.99,
              discountPercentage: 20,
              rating: 4.4,
              stock: 45,
              brand: "AudioTech",
              category: "Electronics",
              thumbnail: "/api/placeholder/400/400"
            },
            {
              id: 4,
              title: "Gaming Headset",
              description: "Professional gaming headset with RGB lighting",
              price: 159.99,
              discountPercentage: 25,
              rating: 4.7,
              stock: 20,
              brand: "GameGear",
              category: "Gaming",
              thumbnail: "/api/placeholder/400/400"
            },
            {
              id: 5,
              title: "Studio Monitor Headphones",
              description: "Professional studio-grade monitoring headphones",
              price: 349.99,
              discountPercentage: 0,
              rating: 4.9,
              stock: 15,
              brand: "AudioPro",
              category: "Electronics",
              thumbnail: "/api/placeholder/400/400"
            }
          ];

          setProduct(mockProduct);
          setRelatedProducts(mockRelatedProducts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const pageVariants = {
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-20 h-4 bg-secondary-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-secondary-200 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-secondary-200 rounded animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-4">
              <div className="aspect-square bg-secondary-200 rounded-2xl animate-pulse"></div>
              <div className="flex space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-secondary-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-secondary-200 rounded animate-pulse"></div>
              <div className="h-4 bg-secondary-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-secondary-200 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-secondary-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-secondary-600 mb-6 max-w-md">
            {error?.message || "Sorry, we couldn't find the product you're looking for. It may have been removed or doesn't exist."}
          </p>
          <div className="space-x-4">
            <Button
              variant="secondary"
              icon={<ChevronLeft />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-secondary-50"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumb */}
      <motion.div variants={itemVariants} className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </button>
              <span className="text-secondary-400">/</span>
              <span className="text-secondary-600">{product.category}</span>
              <span className="text-secondary-400">/</span>
              <span className="text-secondary-900 font-medium">{product.title}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon={<Share2 />}
              onClick={handleShare}
              className="text-secondary-600 hover:text-primary-600"
            >
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Product Detail */}
      <motion.div variants={itemVariants}>
        <ProductDetail product={product} />
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollTrigger direction="up" className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                You Might Also Like
              </h2>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Discover more amazing products that complement your selection.
              </p>
            </ScrollTrigger>

            <ScrollTrigger direction="up" delay={0.2}>
              <ProductGrid
                products={relatedProducts}
                loading={false}
                showFilters={false}
                initialView="grid"
              />
            </ScrollTrigger>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      <ScrollTrigger direction="up" className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Recently Viewed
            </h2>
            <p className="text-secondary-600">
              Take another look at products you've been considering.
            </p>
          </div>

          {/* Placeholder for recently viewed products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="aspect-square bg-secondary-200 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-4 bg-secondary-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-secondary-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </ScrollTrigger>

      {/* Call to Action */}
      <ScrollTrigger direction="up" className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Found What You're Looking For?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Don't wait! Great products like this don't stay in stock forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 hover:bg-white/90 font-semibold px-8 py-4"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Add to Cart
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 font-semibold px-8 py-4"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </ScrollTrigger>
    </motion.div>
  );
};

export default ProductDetailsPage;
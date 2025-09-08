import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Award,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { useAppContext } from '@contexts/AppContext';
import { useAnimation } from '@hooks/useAnimation';
import ProductGrid from '@components/product/ProductGrid';
import ScrollTrigger, { StaggerContainer } from '@components/animation/ScrollTrigger';
import Button from '@components/common/Button';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { openModal } = useAppContext();
  const { animationsEnabled } = useAnimation();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            title: "Premium Wireless Headphones",
            description: "Experience crystal-clear audio with active noise cancellation",
            price: 299.99,
            discountPercentage: 15,
            rating: 4.8,
            stock: 25,
            brand: "AudioTech",
            category: "Electronics",
            thumbnail: "/api/placeholder/400/400"
          },
          {
            id: 2,
            title: "Smart Fitness Watch",
            description: "Track your fitness goals with this advanced smartwatch",
            price: 199.99,
            discountPercentage: 20,
            rating: 4.6,
            stock: 15,
            brand: "FitTech",
            category: "Wearables",
            thumbnail: "/api/placeholder/400/400"
          },
          {
            id: 3,
            title: "Ultra-thin Laptop",
            description: "Powerful performance in a sleek, portable design",
            price: 899.99,
            discountPercentage: 10,
            rating: 4.9,
            stock: 8,
            brand: "TechBook",
            category: "Computers",
            thumbnail: "/api/placeholder/400/400"
          },
          {
            id: 4,
            title: "Wireless Gaming Mouse",
            description: "Precision gaming with ultra-fast response times",
            price: 79.99,
            discountPercentage: 25,
            rating: 4.7,
            stock: 30,
            brand: "GameGear",
            category: "Gaming",
            thumbnail: "/api/placeholder/400/400"
          },
          {
            id: 5,
            title: "4K Webcam",
            description: "Professional quality video calls and streaming",
            price: 149.99,
            discountPercentage: 0,
            rating: 4.5,
            stock: 12,
            brand: "CamPro",
            category: "Cameras",
            thumbnail: "/api/placeholder/400/400"
          },
          {
            id: 6,
            title: "Bluetooth Speaker",
            description: "Powerful sound in a compact, portable design",
            price: 59.99,
            discountPercentage: 30,
            rating: 4.4,
            stock: 50,
            brand: "SoundWave",
            category: "Audio",
            thumbnail: "/api/placeholder/400/400"
          }
        ];
        
        setFeaturedProducts(mockProducts.slice(0, 4));
        setTrendingProducts(mockProducts.slice(2, 6));
        setLoading(false);
      }, 1000);
    };

    loadProducts();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationsEnabled ? 0.8 : 0,
        ease: "easeOut",
        staggerChildren: animationsEnabled ? 0.2 : 0
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

  const stats = [
    { icon: ShoppingBag, label: "Products", value: "10,000+", color: "text-blue-600" },
    { icon: Star, label: "Happy Customers", value: "50,000+", color: "text-yellow-500" },
    { icon: TrendingUp, label: "Orders Delivered", value: "100,000+", color: "text-green-600" },
    { icon: Award, label: "Years Experience", value: "5+", color: "text-purple-600" }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Get your orders delivered in 24 hours or less with our express shipping.",
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      icon: Target,
      title: "Precise Matching",
      description: "Our AI helps you find exactly what you're looking for with smart recommendations.",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Every product is carefully curated and quality-tested before reaching you.",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <motion.div
            className="text-center text-white"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                🎉 New arrivals every week
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Discover Amazing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Products
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Shop the latest trends with unbeatable prices, fast delivery, and exceptional quality.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="secondary"
                size="lg"
                icon={<ShoppingBag />}
                className="bg-white text-primary-700 hover:bg-white/90 font-semibold px-8 py-4"
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Now
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                icon={<ArrowRight />}
                className="text-white border-white/30 hover:bg-white/10 font-semibold px-8 py-4"
                onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Trending
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <ScrollTrigger direction="up" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 mb-4`}>
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </ScrollTrigger>

      {/* Features Section */}
      <ScrollTrigger direction="up" className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience possible.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.color} mb-6`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </ScrollTrigger>

      {/* Featured Products */}
      <section id="featured" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollTrigger direction="up" className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Handpicked products that our customers love the most.
            </p>
          </ScrollTrigger>

          <ScrollTrigger direction="up" delay={0.2}>
            <ProductGrid
              products={featuredProducts}
              loading={loading}
              showFilters={false}
              initialView="grid"
            />
          </ScrollTrigger>

          <ScrollTrigger direction="up" delay={0.4} className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight />}
              className="font-semibold px-8 py-4"
            >
              View All Products
            </Button>
          </ScrollTrigger>
        </div>
      </section>

      {/* Trending Products */}
      <section id="trending" className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollTrigger direction="up" className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-4 py-2 mb-4">
              <TrendingUp size={16} className="mr-2" />
              <span className="text-sm font-medium">Trending Now</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              What's Hot Right Now
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Don't miss out on these popular items that everyone is talking about.
            </p>
          </ScrollTrigger>

          <ScrollTrigger direction="up" delay={0.2}>
            <ProductGrid
              products={trendingProducts}
              loading={loading}
              showFilters={false}
              initialView="grid"
            />
          </ScrollTrigger>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollTrigger direction="up" className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of happy customers and discover amazing products today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              icon={<ShoppingBag />}
              className="bg-white text-primary-700 hover:bg-white/90 font-semibold px-8 py-4"
            >
              Browse Categories
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 font-semibold px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </ScrollTrigger>
    </div>
  );
};

export default Home;
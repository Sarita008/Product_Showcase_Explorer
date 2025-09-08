import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Github, 
  Linkedin, 
  Mail,
  ArrowUp,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { useAnimation } from '@hooks/useAnimation';
import Button from '@components/common/Button';

const Footer = () => {
  const { animationsEnabled, useScrollAnimation } = useAnimation();
  const { ref, inView } = useScrollAnimation({ threshold: 0.1 });

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationsEnabled ? 0.6 : 0,
        staggerChildren: animationsEnabled ? 0.1 : 0
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: animationsEnabled ? 0.4 : 0 }
    }
  };

  return (
    <motion.footer
      ref={ref}
      className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white overflow-hidden"
      variants={footerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* Background Effects */}
      {animationsEnabled && (
        <>
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.1, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center"
                  whileHover={{ 
                    rotate: animationsEnabled ? [0, 5, -5, 0] : 0,
                    scale: animationsEnabled ? 1.05 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ShoppingBag size={24} className="text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-heading font-bold gradient-text bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                    ProductHub
                  </h3>
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: inView ? '80%' : 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>
              
              <p className="text-secondary-300 text-lg leading-relaxed mb-6 max-w-md">
                Discover amazing products with our modern, interactive shopping experience. 
                Built with cutting-edge technology and beautiful animations.
              </p>

              <div className="flex items-center space-x-4">
                <motion.a
                  href="#"
                  className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors"
                  whileHover={{ scale: animationsEnabled ? 1.05 : 1 }}
                  whileTap={{ scale: animationsEnabled ? 0.95 : 1 }}
                >
                  <Github size={20} />
                  <span>View Source</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <Sparkles size={18} className="mr-2 text-primary-400" />
                Features
              </h4>
              <ul className="space-y-3">
                {[
                  'Product Search',
                  'Category Filtering',
                  'Smooth Animations',
                  'Responsive Design',
                  'Modern UI/UX'
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    className="text-secondary-300 hover:text-white transition-colors cursor-pointer"
                    whileHover={{ x: animationsEnabled ? 5 : 0 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: inView ? 1 : 0, 
                      x: inView ? 0 : -10 
                    }}
                    transition={{ 
                      delay: animationsEnabled ? 0.2 + index * 0.1 : 0,
                      duration: animationsEnabled ? 0.3 : 0
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Tech Stack */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6">Built With</h4>
              <ul className="space-y-3">
                {[
                  'React.js',
                  'Framer Motion',
                  'Tailwind CSS',
                  'Vite',
                  'DummyJSON API'
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    className="text-secondary-300 hover:text-primary-300 transition-colors cursor-pointer"
                    whileHover={{ x: animationsEnabled ? 5 : 0 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: inView ? 1 : 0, 
                      x: inView ? 0 : -10 
                    }}
                    transition={{ 
                      delay: animationsEnabled ? 0.3 + index * 0.1 : 0,
                      duration: animationsEnabled ? 0.3 : 0
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-secondary-700/50 bg-secondary-900/50 backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* Copyright */}
              <motion.div
                className="flex items-center space-x-2 text-secondary-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ delay: animationsEnabled ? 0.6 : 0 }}
              >
                <span>Made with</span>
                <motion.div
                  animate={{
                    scale: animationsEnabled ? [1, 1.2, 1] : 1,
                    rotate: animationsEnabled ? [0, 5, -5, 0] : 0
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart size={16} className="text-red-400 fill-current" />
                </motion.div>
                <span>for Razorpod</span>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ delay: animationsEnabled ? 0.7 : 0 }}
              >
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Mail, href: '#', label: 'Email' }
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="p-2 rounded-xl bg-secondary-800/50 hover:bg-secondary-700/50 text-secondary-400 hover:text-white transition-all duration-300"
                    whileHover={{ 
                      scale: animationsEnabled ? 1.1 : 1,
                      y: animationsEnabled ? -2 : 0
                    }}
                    whileTap={{ scale: animationsEnabled ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: animationsEnabled ? 0.8 + index * 0.1 : 0,
                      duration: animationsEnabled ? 0.3 : 0
                    }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </motion.div>

              {/* Back to Top */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ delay: animationsEnabled ? 0.8 : 0 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ArrowUp />}
                  onClick={scrollToTop}
                  className="text-secondary-400 hover:text-white border border-secondary-700 hover:border-secondary-600"
                >
                  Back to Top
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
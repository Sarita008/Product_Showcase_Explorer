import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAnimation } from '@hooks/useAnimation';
import ProductDetail from './ProductDetail';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  productId, 
  product 
}) => {
  const { animationsEnabled } = useAnimation();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const overlayVariants = {
    hidden: { 
      opacity: 0,
      transition: { duration: animationsEnabled ? 0.2 : 0 }
    },
    visible: { 
      opacity: 1,
      transition: { duration: animationsEnabled ? 0.3 : 0 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { 
        duration: animationsEnabled ? 0.2 : 0,
        ease: "easeIn"
      }
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: animationsEnabled ? 0.3 : 0,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-secondary-200 p-4 z-10 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-lg font-semibold text-secondary-900">
                Product Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-0">
              <ProductDetail
                productId={productId}
                product={product}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
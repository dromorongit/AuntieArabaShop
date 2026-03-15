'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/products/${product._id}`}>
        <div
          className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            )}

            {/* Overlay Actions */}
            <div
              className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={handleAddToCart}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-500 hover:text-white transition-colors transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
              <Link
                href={`/products/${product._id}`}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-500 hover:text-white transition-colors transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75"
              >
                <Eye className="w-5 h-5" />
              </Link>
              <button className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-500 hover:text-white transition-colors transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {!product.inStock && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Category Tag */}
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-600 text-xs font-medium rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-400">
                {product.sizes?.length ? `${product.sizes.length} sizes` : ''}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

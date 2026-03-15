'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Share2, ShoppingBag, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

// Sample product data - in production this would come from database
const sampleProducts: Record<string, Product> = {
  '1': {
    _id: '1',
    name: 'Elegant Pink Evening Dress',
    description: 'Beautiful elegant dress perfect for special occasions. Made with premium fabric for maximum comfort and style. Features a flattering silhouette that complements all body types.',
    price: 350,
    images: ['/LADYSTANDARD.PNG'],
    category: 'Elegant Dresses',
    categorySlug: 'elegant-dresses',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Purple', 'Black'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  '2': {
    _id: '2',
    name: 'Trendy Crop Top',
    description: 'Stylish crop top for casual wear. Perfect for pairing with jeans or skirts.',
    price: 95,
    images: ['/LADYSTANDARD.PNG'],
    category: 'Crop Tops',
    categorySlug: 'crop-tops',
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Black', 'Pink'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  '4': {
    _id: '4',
    name: 'Comfy Romper',
    description: 'Soft and comfortable romper for relaxed nights at home.',
    price: 180,
    images: ['/ROMPER.jpg'],
    category: 'Night Wear',
    categorySlug: 'night-wear',
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['Blue', 'Pink'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  '5': {
    _id: '5',
    name: 'Classic Bum Shorts',
    description: 'Trendy bum shorts for everyday wear. Comfortable and stylish.',
    price: 120,
    images: ['/BUMSHORTS.jpg'],
    category: 'Bum Shorts',
    categorySlug: 'bum-shorts',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Denim', 'White'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  '6': {
    _id: '6',
    name: 'Elegant Evening Dress',
    description: 'Beautiful dress for special occasions. Features elegant design with premium fabric.',
    price: 350,
    images: ['/LADYSTANDARD.PNG'],
    category: 'Elegant Dresses',
    categorySlug: 'elegant-dresses',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Black', 'Navy'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  '7': {
    _id: '7',
    name: 'NFL Super Bowl Jersey',
    description: 'Authentic unisex NFL jersey for football fans. Official licensed product.',
    price: 280,
    images: ['/NFLJERSEY.jpg'],
    category: 'Unisex NFL Jerseys',
    categorySlug: 'unisex-nfl-jerseys',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Home', 'Away'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = sampleProducts[id];

  if (!product) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return <ProductContent product={product} />;
}

function ProductContent({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, 1, selectedSize || undefined, selectedColor || undefined);
    openCart();
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ShoppingBag className="w-20 h-20 text-gray-300" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Link
                href={`/categories/${product.categorySlug}`}
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                {product.category}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <Check className="w-5 h-5" />
                  In Stock
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors ${
                        selectedSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors ${
                        selectedColor === color
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-full hover:border-red-500 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-500 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

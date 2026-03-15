'use client';

import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/lib/utils';
import { Product } from '@/types';

// Sample products data - in production this would come from database
const allProducts: Record<string, Product[]> = {
  'ladies-basic-tops': [
    {
      _id: '1',
      name: 'Basic Pink Top',
      description: 'Comfortable cotton blend basic top',
      price: 80,
      images: ['/LADYSTANDARD.PNG'],
      category: 'Ladies Basic Tops',
      categorySlug: 'ladies-basic-tops',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  'crop-tops': [
    {
      _id: '2',
      name: 'Trendy Crop Top',
      description: 'Stylish crop top for casual wear',
      price: 95,
      images: ['/LADYSTANDARD.PNG'],
      category: 'Crop Tops',
      categorySlug: 'crop-tops',
      inStock: true,
      sizes: ['S', 'M', 'L'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  'night-wear': [
    {
      _id: '4',
      name: 'Comfy Romper',
      description: 'Soft and comfortable romper for relaxed nights',
      price: 180,
      images: ['/ROMPER.jpg'],
      category: 'Night Wear',
      categorySlug: 'night-wear',
      inStock: true,
      sizes: ['S', 'M', 'L'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  'bum-shorts': [
    {
      _id: '5',
      name: 'Classic Bum Shorts',
      description: 'Trendy bum shorts for everyday wear',
      price: 120,
      images: ['/BUMSHORTS.jpg'],
      category: 'Bum Shorts',
      categorySlug: 'bum-shorts',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  'elegant-dresses': [
    {
      _id: '6',
      name: 'Elegant Evening Dress',
      description: 'Beautiful dress for special occasions',
      price: 350,
      images: ['/LADYSTANDARD.PNG'],
      category: 'Elegant Dresses',
      categorySlug: 'elegant-dresses',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  'unisex-nfl-jerseys': [
    {
      _id: '7',
      name: 'NFL Super Bowl Jersey',
      description: 'Authentic NFL jersey for football fans',
      price: 280,
      images: ['/NFLJERSEY.jpg'],
      category: 'Unisex NFL Jerseys',
      categorySlug: 'unisex-nfl-jerseys',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products = allProducts[slug] || [];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {category.name}
          </h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No products available in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

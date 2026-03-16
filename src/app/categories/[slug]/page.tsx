'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/lib/utils';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const getParams = async () => {
      const { slug: paramSlug } = await params;
      setSlug(paramSlug);
      
      const category = categories.find((c) => c.slug === paramSlug);
      if (category) {
        setCategoryName(category.name);
      }

      // Fetch products for this category
      try {
        const response = await fetch(`/api/products?categorySlug=${paramSlug}&limit=50`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    getParams();
  }, [params]);

  if (!slug) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

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
            {categoryName || category.name}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} ${products.length === 1 ? 'product' : 'products'} available`}
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-gray-500">Loading products...</div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product._id ? String(product._id) : `product-${index}`} product={product} index={index} />
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

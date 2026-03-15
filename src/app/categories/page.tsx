'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/lib/utils';

export default function CategoriesPage() {
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
            Shop by Category
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of fashion items across all categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="group relative h-64 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 group-hover:from-primary-100 group-hover:to-secondary-100 transition-all duration-300" />
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 mb-4 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <span className="text-3xl text-white font-bold">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      View Products
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

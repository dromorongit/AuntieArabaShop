'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Counter from '@/components/Counter';
import { categories, formatPrice } from '@/lib/utils';

// Sample products for demo (will be replaced with database data)
const sampleProducts = [
  {
    _id: '1',
    name: 'Elegant Pink Evening Dress',
    description: 'Beautiful elegant dress perfect for special occasions',
    price: 350,
    images: ['/LADYSTANDARD.PNG'],
    category: 'Elegant Dresses',
    categorySlug: 'elegant-dresses',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Classic Bum Shorts',
    description: 'Comfortable and stylish bum shorts for everyday wear',
    price: 120,
    images: ['/BUMSHORTS.jpg'],
    category: 'Bum Shorts',
    categorySlug: 'bum-shorts',
    inStock: true,
    sizes: ['S', 'M', 'L'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'NFL Super Bowl Jersey',
    description: 'Authentic unisex NFL jersey for football fans',
    price: 280,
    images: ['/NFLJERSEY.jpg'],
    category: 'Unisex NFL Jerseys',
    categorySlug: 'unisex-nfl-jerseys',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Romper Night Wear',
    description: 'Comfortable and cute romper for relaxed nights',
    price: 180,
    images: ['/ROMPER.jpg'],
    category: 'Night Wear',
    categorySlug: 'night-wear',
    inStock: true,
    sizes: ['S', 'M', 'L'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping across Ghana',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Multiple payment options for your convenience',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'We are here to help anytime',
  },
  {
    icon: Star,
    title: 'Quality Products',
    description: 'Premium quality guaranteed',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-secondary-100" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100/50 rounded-full">
                <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
                <span className="text-sm font-medium text-primary-700">
                  Ghana's Favorite Fashion Store
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Discover Your
                </span>
                <br />
                <span className="text-gray-800">Perfect Style</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg">
                Explore our premium collection of ladies wear, from elegant dresses to comfortable 
                night wear. Quality fashion at prices you'll love.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-primary-500 hover:text-primary-500 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-primary-600"><Counter value={10000} suffix="+" /></p>
                  <p className="text-sm text-gray-500">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600"><Counter value={500} suffix="+" /></p>
                  <p className="text-sm text-gray-500">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600"><Counter value={4.9} suffix="" /></p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-[2rem] rotate-6" />
                <div className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
                        <span className="text-5xl font-bold text-white">A</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Auntie Araba</h3>
                      <p className="text-gray-600">Premium Fashion</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our extensive collection of fashion items
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <div className="group relative h-48 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 group-hover:from-primary-100 group-hover:to-secondary-100 transition-all duration-300" />
                    <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 mb-4 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl text-white font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              View All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our most popular items
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get 10% Off Your First Order
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Use code FIRST10 at checkout. Valid for new customers only.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter to get the latest updates on new arrivals and special offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

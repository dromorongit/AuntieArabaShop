'use client';

import { motion } from 'framer-motion';
import { Store, Heart, Award, Users } from 'lucide-react';
import Counter from '@/components/Counter';

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: 10000, suffix: '+' },
    { label: 'Products', value: 500, suffix: '+' },
    { label: 'Years Experience', value: 5, suffix: '+' },
    { label: 'Rating', value: 4.9, suffix: '' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize our customers\' needs and strive to provide the best shopping experience.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every product is carefully selected and quality-checked before reaching our customers.',
    },
    {
      icon: Store,
      title: 'Authentic Products',
      description: 'We guarantee 100% authentic products from trusted suppliers.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a community of fashion enthusiasts who love quality and style.',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-100 via-white to-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Shop Auntie Araba</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your premier destination for stylish ladies wear in Ghana. We believe that everyone deserves to look and feel their best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-primary-600 mb-2"><Counter value={stat.value} suffix={stat.suffix} /></p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Shop Auntie Araba was founded with a simple mission: to provide high-quality, 
                  stylish fashion at affordable prices for women across Ghana.
                </p>
                <p>
                  What started as a small boutique has grown into one of the most trusted 
                  online fashion destinations in the country. We take pride in curating the 
                  best selection of ladies wear, from casual basics to elegant evening wear.
                </p>
                <p>
                  Our commitment to quality, authenticity, and customer satisfaction has earned 
                  us a loyal customer base and made us a household name in Ghanaian fashion.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl"
            >
              <div className="absolute inset-4 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">A</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Shop Auntie Araba</h3>
                  <p className="text-gray-500">Since 2020</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at Shop Auntie Araba
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Shop With Us?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Discover our latest collection and find your perfect style today.
            </p>
            <a
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Browse Categories
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <Image
                  src="/LADYSTANDARD.PNG"
                  alt="Shop Auntie Araba Logo"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-2xl font-bold">Shop Auntie Araba</span>
            </div>
            <p className="text-primary-100 text-sm">
              Your premier destination for stylish ladies wear in Ghana. Quality
              fashion at affordable prices.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/233244152807`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-primary-100 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/ladies-basic-tops" className="text-primary-100 hover:text-white transition-colors">
                  Ladies Basic Tops
                </Link>
              </li>
              <li>
                <Link href="/categories/crop-tops" className="text-primary-100 hover:text-white transition-colors">
                  Crop Tops
                </Link>
              </li>
              <li>
                <Link href="/categories/elegant-dresses" className="text-primary-100 hover:text-white transition-colors">
                  Elegant Dresses
                </Link>
              </li>
              <li>
                <Link href="/categories/office-dresses" className="text-primary-100 hover:text-white transition-colors">
                  Office Dresses
                </Link>
              </li>
              <li>
                <Link href="/categories/unisex-nfl-jerseys" className="text-primary-100 hover:text-white transition-colors">
                  NFL Jerseys
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-300 mt-0.5" />
                <span className="text-primary-100">+233 244 152 807</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-300 mt-0.5" />
                <span className="text-primary-100">marydiamondgh@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-300 mt-0.5" />
                <span className="text-primary-100">Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-primary-200">
            &copy; {currentYear} Shop Auntie Araba. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

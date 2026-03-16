'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, generateOrderId, formatWhatsAppMessage, whatsappNumber } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'mobile_money' as 'mobile_money' | 'cod' | 'bank_transfer',
  });

  const total = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    const orderId = generateOrderId();
    const message = formatWhatsAppMessage(
      orderId,
      formData.name,
      formData.phone,
      items,
      total,
      formData.paymentMethod,
      formData.address
    );

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    // Clear cart after order
    clearCart();
    setIsSubmitting(false);
  };

  const paymentMethods = [
    { id: 'mobile_money', label: 'Mobile Money', description: 'Pay via MTN or Vodafone MoMo' },
    { id: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your order' },
    { id: 'bank_transfer', label: 'Bank Transfer', description: 'Transfer to our bank account' },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm sm:text-base text-gray-600 hover:text-primary-600 mb-4 sm:mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Continue Shopping
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {/* Order Summary */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-2 sm:gap-4">
                    <div className="relative w-14 h-16 sm:w-20 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' | '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product._id!, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id!, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product._id!)}
                        className="text-gray-400 hover:text-red-500 mt-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Shipping Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-sm sm:text-base"
                    placeholder="e.g., +233 244 123 456"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-sm sm:text-base"
                    placeholder="Enter your delivery address"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Payment Method *
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: e.target.value as typeof formData.paymentMethod,
                            })
                          }
                          className="mt-0.5 sm:mt-1"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">{method.label}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
                </button>

                <p className="text-xs sm:text-sm text-gray-500 text-center">
                  After placing your order, you will be redirected to WhatsApp to complete your order.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

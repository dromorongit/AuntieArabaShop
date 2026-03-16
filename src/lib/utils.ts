import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(price);
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AA-${timestamp}-${random}`;
}

export function formatWhatsAppMessage(
  orderId: string,
  customerName: string,
  customerPhone: string,
  items: Array<{ product: { name: string }; quantity: number; selectedSize?: string; selectedColor?: string }>,
  totalAmount: number,
  paymentMethod: string,
  deliveryAddress: string
): string {
  const itemsList = items
    .map(
      (item) =>
        `- ${item.product.name} x${item.quantity}${
          item.selectedSize ? ` (Size: ${item.selectedSize})` : ''
        }${item.selectedColor ? ` (Color: ${item.selectedColor})` : ''}`
    )
    .join('\n');

  const paymentMethodMap: Record<string, string> = {
    mobile_money: 'Mobile Money',
    cod: 'Cash on Delivery',
    bank_transfer: 'Bank Transfer',
  };

  const message = `*New Order - Shop Auntie Araba*

*Order ID:* ${orderId}
*Customer Name:* ${customerName}
*Customer Phone:* ${customerPhone}

*Products Ordered:*
${itemsList}

*Total Amount:* ₵${totalAmount.toFixed(2)}
*Payment Method:* ${paymentMethodMap[paymentMethod] || paymentMethod}
*Delivery Address:* ${deliveryAddress}

Thank you for shopping with Shop Auntie Araba!`;

  return encodeURIComponent(message);
}

export const categories = [
  { name: 'Ladies Basic Tops', slug: 'ladies-basic-tops', image: '/ladiesbasictops.jpg' },
  { name: 'Crop Tops', slug: 'crop-tops', image: '/croptops.jpg' },
  { name: 'Night Wear', slug: 'night-wear', image: '/nightwear.jpg' },
  { name: 'Bum Shorts', slug: 'bum-shorts', image: '/bumshortsimage.jpg' },
  { name: '2 in 1 Night Wears', slug: '2-in-1-night-wears', image: '/2in1nightwear.jpg' },
  { name: '2 in 1 Tops and Downs', slug: '2-in-1-tops-and-downs', image: '/2in1topsanddowns.jpg' },
  { name: 'Elegant Dresses', slug: 'elegant-dresses', image: '/elegantdresses.jpg' },
  { name: 'Stylish Dresses', slug: 'stylish-dresses', image: '/stylishdresses.jpg' },
  { name: 'Office Dresses', slug: 'office-dresses', image: '/officedresses.jpg' },
  { name: 'Panties', slug: 'panties', image: '/panties.jpg' },
  { name: 'Unisex NFL Jerseys', slug: 'unisex-nfl-jerseys', image: '/nfljerseys.jpg' },
];

export const whatsappNumber = '233244152807';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categorySlug: string;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Customer {
  _id?: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

export interface Order {
  _id?: string;
  orderId: string;
  customer: Customer;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'mobile_money' | 'cod' | 'bank_transfer';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'mobile_money' | 'cod' | 'bank_transfer';
}

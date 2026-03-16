// Product Variant Types
export interface ProductVariant {
  color: string;
  colorHex?: string;
  size: string;
  stock: number;
  image?: string;
  sku?: string;
}

export interface Product {
  _id?: import('mongodb').ObjectId | string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  inStock: boolean;
  stock?: number;
  variants?: ProductVariant[];
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
  isBestSelling?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id?: import('mongodb').ObjectId | string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  isActive?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  variant?: ProductVariant;
}

export interface Customer {
  _id?: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  variant?: ProductVariant;
}

export interface Order {
  _id?: import('mongodb').ObjectId | string;
  orderId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: 'mobile_money' | 'cod' | 'bank_transfer';
  products: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Admin Types
export interface Admin {
  _id?: import('mongodb').ObjectId | string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
}

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
  role: string;
}

// Analytics Types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
  image: string;
}

// Search Types
export interface SearchResult {
  products: Product[];
  totalResults: number;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'best_selling' | 'name_asc' | 'name_desc';
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'mobile_money' | 'cod' | 'bank_transfer';
}

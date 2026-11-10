export type ShoeCategory = 'womens' | 'mens' | 'kids' | 'wholesale';

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ShoeCategory;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: string;
  description: string;
  features: string[];
  colors: ColorVariant[];
  sizes: number[]; // e.g. [37, 38, 39, 40]
  inStock: boolean;
  stockCount: number;
  wholesaleMinQty?: number;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id based on product + color + size
  product: Product;
  selectedColor: ColorVariant;
  selectedSize: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  colorName: string;
  colorHex: string;
  size: number;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: 'cod'; // Cash on Delivery
  customerEmail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  deliveryFee: number;
  freeShippingPairThreshold: number; // e.g., 2 pairs
  adminEmail: string;
  adminPasswordHash: string; // Stored securely
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  announcementText: string;
}

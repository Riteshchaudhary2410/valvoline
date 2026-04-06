export type UserRole = 'CUSTOMER' | 'MECHANIC' | 'GARAGE' | 'ADMIN';

export interface User {
  id: string;
  name: string | null;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  company?: string;
  gstNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductType = 'ENGINE_OIL' | 'GEAR_OIL' | 'HYDRAULIC_OIL' | 'GREASE' | 'INDUSTRIAL_OILS'| 'BRAKE_OIL';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[];
  type: ProductType;
  viscosity?: string;
  quantity: number;
  quantityUnit: string;
  price: number;
  bulkPrice?: number;
  discount?: number;
  vehicleTypes?: string[];
  useCase?: string;
  benefits?: string[];
  specifications?: string[];
  compatibilityNotes?: string[];
  recommendedKmRange?: [number, number];
  serviceIntervalKm?: number;
  stock: number;
  sku: string;
  packageGroup?: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleProfile {
  id: string;
  userId: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  engine?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  stripePaymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleCompatibility {
  id: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  engine?: string;
  recommendedProducts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterOptions {
  vehicleType?: string;
  brand?: string;
  model?: string;
  oilType?: ProductType;
  viscosity?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface VehicleSelection {
  type?: string;
  brand?: string;
  model?: string;
  year?: number;
  engine?: string;
  kmDriven?: number;
}

export interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const calculateDiscount = (original: number, discounted: number): number => {
  return Math.round(((original - discounted) / original) * 100);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value);
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

export const getTaxRate = (): number => {
  const HST_RATE = 0.18; // 18% GST in India
  return HST_RATE;
};

export const calculateTax = (amount: number): number => {
  return Math.round(amount * getTaxRate() * 100) / 100;
};

export const calculateShipping = (total: number): number => {
  const FREE_SHIPPING_THRESHOLD = 2000;
  const STANDARD_SHIPPING_COST = 199;
  return total >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
};

/**
 * Validate and sanitize product quantity for cart operations
 */
export const validateQuantity = (quantity: unknown): number => {
  const parsed = typeof quantity === 'number' ? quantity : Number(quantity);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error('Quantity must be a positive number');
  }
  return Math.floor(parsed);
};

/**
 * Validate product slug format
 */
export const validateProductSlug = (slug: unknown): string => {
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Product slug is required and must be a non-empty string');
  }
  return slug.trim();
};



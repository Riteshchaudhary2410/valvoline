import { Schema, model, models, type Model, type Types } from 'mongoose';
import type { ProductType } from '@/types';

export const PRODUCT_TYPES = ['ENGINE_OIL', 'GEAR_OIL', 'HYDRAULIC_OIL', 'GREASE', 'INDUSTRIAL_OILS', 'BRAKE_OIL'] as const satisfies readonly ProductType[];

export interface ProductAttributes {
  name: string;
  slug: string;
  brand: string;
  description: string;
  longDescription?: string;
  packageGroup?: string;
  type: ProductType;
  viscosity?: string;
  quantityUnit: string;
  price: number;
  bulkPrice?: number;
  discount?: number;
  quantity: number;
  image: string;
  images: string[];
  vehicleTypes?: string[];
  useCase?: string;
  benefits?: string[];
  specifications?: string[];
  compatibilityNotes?: string[];
  recommendedKmRange?: [number, number];
  serviceIntervalKm?: number;
  stock: number;
  sku: string;
  featured: boolean;
  active: boolean;
}

export interface ProductRecord extends ProductAttributes {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMongoRecord extends ProductAttributes {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductAttributes>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, trim: true },
    packageGroup: { type: String, trim: true },
    type: { type: String, required: true, enum: PRODUCT_TYPES },
    viscosity: { type: String, trim: true },
    quantityUnit: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    bulkPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    vehicleTypes: { type: [String], default: [] },
    useCase: { type: String, trim: true },
    benefits: { type: [String], default: [] },
    specifications: { type: [String], default: [] },
    compatibilityNotes: { type: [String], default: [] },
    recommendedKmRange: { type: [Number], default: undefined },
    serviceIntervalKm: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, trim: true, unique: true, index: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ProductModel =
  (models.Product as Model<ProductAttributes>) || model<ProductAttributes>('Product', productSchema);

export function serializeProduct(product: ProductMongoRecord): ProductRecord {
  const { _id, createdAt, updatedAt, ...rest } = product;

  return {
    id: _id.toString(),
    ...rest,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

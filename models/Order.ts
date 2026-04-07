import { Schema, model, models, type Model, type Types } from 'mongoose';
import type { OrderStatus, PaymentStatus } from '@/types';

export type OrderStatusType = OrderStatus;
export type PaymentStatusType = PaymentStatus;

export interface OrderItemAttributes {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface OrderAttributes {
  orderNumber: string;
  customerUserId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerState?: string;
  customerZip?: string;
  items: OrderItemAttributes[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatusType;
  paymentMethod: string;
  paymentStatus: PaymentStatusType;
  stripePaymentId?: string;
  notes?: string;
}

export interface OrderMongoRecord extends OrderAttributes {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRecord extends OrderAttributes {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const orderItemSchema = new Schema<OrderItemAttributes>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true, trim: true },
    productImage: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderAttributes>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true, trim: true },
    customerUserId: { type: String, trim: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true, index: true },
    customerPhone: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true, trim: true },
    customerCity: { type: String, trim: true },
    customerState: { type: String, trim: true },
    customerZip: { type: String, trim: true },
    items: { type: [orderItemSchema], required: true, default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    paymentMethod: { type: String, required: true, trim: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    stripePaymentId: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const OrderModel =
  (models.Order as Model<OrderAttributes>) || model<OrderAttributes>('Order', orderSchema);

export function serializeOrder(input: OrderMongoRecord | (OrderMongoRecord & { toObject?: () => OrderMongoRecord })): OrderRecord {
  const source =
    typeof (input as { toObject?: () => OrderMongoRecord }).toObject === 'function'
      ? (input as { toObject: () => OrderMongoRecord }).toObject()
      : (input as OrderMongoRecord);

  const { _id, createdAt, updatedAt, items, ...rest } = source;
  const safeCreatedAt = new Date(createdAt);
  const safeUpdatedAt = new Date(updatedAt);

  return {
    id: String(_id),
    ...rest,
    items: Array.isArray(items) ? items : [],
    createdAt: Number.isNaN(safeCreatedAt.getTime()) ? new Date(0).toISOString() : safeCreatedAt.toISOString(),
    updatedAt: Number.isNaN(safeUpdatedAt.getTime()) ? new Date(0).toISOString() : safeUpdatedAt.toISOString(),
  };
}

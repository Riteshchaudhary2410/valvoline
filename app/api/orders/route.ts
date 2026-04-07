import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderModel, serializeOrder } from '@/models/Order';
import { calculateShipping, calculateTax } from '@/lib/utils';

interface CreateOrderPayload {
  customerUserId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerState?: string;
  customerZip?: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  paymentMethod: string;
}

interface UpdateOrderPayload {
  status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${random}-${timestamp.slice(-6)}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerUserId = searchParams.get('customerUserId')?.trim();
    const customerEmail = searchParams.get('customerEmail')?.trim().toLowerCase();
    const customerPhone = searchParams.get('customerPhone')?.trim();
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Backfill user ownership for legacy orders when we can match safely by account email.
    if (customerUserId && customerEmail) {
      await OrderModel.updateMany(
        {
          customerEmail,
          $or: [
            { customerUserId: { $exists: false } },
            { customerUserId: null },
            { customerUserId: '' },
          ],
        },
        { $set: { customerUserId } }
      );
    }

    // Backfill old orders created before customerEmail existed.
    if (customerEmail && customerPhone) {
      await OrderModel.updateMany(
        {
          customerPhone,
          $or: [
            { customerEmail: { $exists: false } },
            { customerEmail: null },
            { customerEmail: '' },
          ],
        },
        { $set: { customerEmail } }
      );
    }

    const andConditions: Array<Record<string, unknown>> = [];

    if (status) {
      andConditions.push({ status });
    }

    if (customerUserId && customerEmail) {
      andConditions.push({
        $or: [{ customerUserId }, { customerEmail }],
      });
    } else if (customerUserId) {
      andConditions.push({ customerUserId });
    } else if (customerEmail && customerPhone) {
      andConditions.push({
        $or: [{ customerEmail }, { customerPhone }],
      });
    } else if (customerEmail) {
      andConditions.push({ customerEmail });
    } else if (customerPhone) {
      andConditions.push({ customerPhone });
    }

    const filter: Record<string, unknown> =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await OrderModel.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        orders: orders.map((order) => serializeOrder(order as any)),
        total,
        limit,
        skip,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = (await request.json()) as CreateOrderPayload;

    // Validate required fields
    if (!payload.customerName || !payload.customerPhone || !payload.customerAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!payload.items || payload.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (payload.subtotal <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid subtotal' },
        { status: 400 }
      );
    }

    // Calculate totals
    const tax = calculateTax(payload.subtotal);
    const shipping = calculateShipping(payload.subtotal);
    const total = payload.subtotal + tax + shipping;

    // Create order
    const orderNumber = generateOrderNumber();
    const order = new OrderModel({
      orderNumber,
      customerUserId: payload.customerUserId?.trim(),
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail?.trim().toLowerCase(),
      customerPhone: payload.customerPhone.trim(),
      customerAddress: payload.customerAddress.trim(),
      customerCity: payload.customerCity?.trim(),
      customerState: payload.customerState?.trim(),
      customerZip: payload.customerZip?.trim(),
      items: payload.items,
      subtotal: payload.subtotal,
      tax,
      shipping,
      total,
      status: 'PENDING',
      paymentMethod: payload.paymentMethod || 'COD',
      paymentStatus: 'PENDING',
    });

    const savedOrder = await order.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        order: serializeOrder(savedOrder as any),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const payload = (await request.json()) as UpdateOrderPayload;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        ...(payload.status && { status: payload.status }),
        ...(payload.notes !== undefined && { notes: payload.notes }),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order updated successfully',
        order: serializeOrder(updatedOrder as any),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

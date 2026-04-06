import { isValidObjectId } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { ApiError } from '@/lib/http-error';
import { createProductSchema, updateProductSchema } from '@/lib/product-validation';
import { ProductModel, type ProductMongoRecord, type ProductRecord, serializeProduct } from '@/models/Product';
import { slugify } from '@/lib/utils';
import type { ProductType } from '@/types';

export interface ProductListFilters {
  search?: string;
  slug?: string;
  packageGroup?: string;
  type?: ProductType;
  vehicleType?: string;
  brand?: string;
  viscosity?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveIdentifierFilter = (identifier: string) =>
  isValidObjectId(identifier) ? { _id: identifier } : { slug: identifier.toLowerCase() };

export async function listProducts(filters: ProductListFilters = {}): Promise<ProductRecord[]> {
  await connectToDatabase();

  const query: Record<string, unknown> = {};

  if (filters.slug) {
    query.slug = filters.slug.toLowerCase();
  }

  if (filters.packageGroup) {
    query.packageGroup = filters.packageGroup;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.vehicleType) {
    query.vehicleTypes = filters.vehicleType;
  }

  if (filters.brand) {
    query.brand = new RegExp(escapeRegExp(filters.brand.trim()), 'i');
  }

  if (filters.viscosity) {
    query.viscosity = filters.viscosity;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};

    if (filters.minPrice !== undefined) {
      (query.price as { $gte?: number }).$gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      (query.price as { $lte?: number }).$lte = filters.maxPrice;
    }
  }

  if (typeof filters.active === 'boolean') {
    query.active = filters.active;
  }

  if (filters.search) {
    const searchPattern = new RegExp(escapeRegExp(filters.search.trim()), 'i');
    query.$or = [{ name: searchPattern }, { slug: searchPattern }, { description: searchPattern }, { brand: searchPattern }, { useCase: searchPattern }];
  }

  const products = (await ProductModel.find(query).sort({ createdAt: -1 }).lean<ProductMongoRecord[]>()) ?? [];

  return products.map(serializeProduct);
}

export async function getProduct(identifier: string): Promise<ProductRecord> {
  await connectToDatabase();

  const product = await ProductModel.findOne(resolveIdentifierFilter(identifier)).lean<ProductMongoRecord>();

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  return serializeProduct(product);
}

export async function createProduct(input: unknown): Promise<ProductRecord> {
  await connectToDatabase();

  const validated = createProductSchema.parse(input);
  const slug = (validated.slug || slugify(validated.name)).toLowerCase();
  const existingProduct = await ProductModel.findOne({ slug }).lean<ProductMongoRecord>();

  if (existingProduct) {
    throw new ApiError('A product with this slug already exists', 409);
  }

  const image = validated.image || '/drum_Oil.webp';

  const createdProduct = await ProductModel.create({
    name: validated.name,
    brand: validated.brand ?? validated.name,
    description: validated.description ?? `${validated.name} product`,
    longDescription: validated.longDescription,
    packageGroup: validated.packageGroup,
    type: validated.type,
    viscosity: validated.viscosity,
    quantityUnit: validated.quantityUnit ?? 'ml',
    price: validated.price,
    bulkPrice: validated.bulkPrice,
    discount: validated.discount,
    quantity: validated.quantity ?? 1,
    image,
    images: validated.images ?? [image],
    vehicleTypes: validated.vehicleTypes ?? [],
    useCase: validated.useCase,
    benefits: validated.benefits ?? [],
    specifications: validated.specifications ?? [],
    compatibilityNotes: validated.compatibilityNotes ?? [],
    recommendedKmRange: validated.recommendedKmRange,
    serviceIntervalKm: validated.serviceIntervalKm,
    stock: validated.stock ?? 0,
    sku: validated.sku ?? slug,
    featured: validated.featured ?? false,
    active: validated.active ?? true,
    slug,
  });

  return serializeProduct(createdProduct.toObject() as unknown as ProductMongoRecord);
}

export async function updateProduct(identifier: string, input: unknown): Promise<ProductRecord> {
  await connectToDatabase();

  const validated = updateProductSchema.parse(input);
  const existingProduct = await ProductModel.findOne(resolveIdentifierFilter(identifier)).lean<ProductMongoRecord>();

  if (!existingProduct) {
    throw new ApiError('Product not found', 404);
  }

  if (validated.slug) {
    const normalizedSlug = validated.slug.toLowerCase();
    const slugOwner = await ProductModel.findOne({ slug: normalizedSlug }).lean<ProductMongoRecord>();

    if (slugOwner && slugOwner._id.toString() !== existingProduct._id.toString()) {
      throw new ApiError('A product with this slug already exists', 409);
    }

    validated.slug = normalizedSlug;
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(existingProduct._id, validated, {
    new: true,
    runValidators: true,
  }).lean<ProductMongoRecord>();

  if (!updatedProduct) {
    throw new ApiError('Product not found', 404);
  }

  return serializeProduct(updatedProduct);
}

export async function deleteProduct(identifier: string): Promise<{ id: string; deleted: boolean }> {
  await connectToDatabase();

  const existingProduct = await ProductModel.findOne(resolveIdentifierFilter(identifier)).lean<ProductMongoRecord>();

  if (!existingProduct) {
    throw new ApiError('Product not found', 404);
  }

  await ProductModel.findByIdAndDelete(existingProduct._id);

  return {
    id: existingProduct._id.toString(),
    deleted: true,
  };
}

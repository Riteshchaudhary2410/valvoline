import { z } from 'zod';
import * as XLSX from 'xlsx';
import { slugify } from '@/lib/utils';
import { PRODUCT_TYPES } from '@/models/Product';
import type { ProductAttributes } from '@/models/Product';

const excelRowSchema = z.object({
  name: z.string().trim().min(1),
  price: z.coerce.number().nonnegative(),
  type: z.enum(PRODUCT_TYPES).optional().default('ENGINE_OIL'),
  stock: z.coerce.number().int().nonnegative().optional().default(0),
  image: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  description: z.string().trim().optional(),
  longDescription: z.string().trim().optional(),
  packageGroup: z.string().trim().optional(),
  viscosity: z.string().trim().optional(),
  quantityUnit: z.string().trim().optional(),
  quantity: z.coerce.number().int().nonnegative().optional(),
  bulkPrice: z.coerce.number().nonnegative().optional(),
  discount: z.coerce.number().nonnegative().optional(),
  useCase: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
});

export type ExcelRowInput = z.infer<typeof excelRowSchema>;

export interface ExcelImportProduct extends ProductAttributes {
  slug: string;
}

function toStringOrUndefined(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const normalized = value.map((item) => String(item).trim()).filter(Boolean);
    return normalized.length ? normalized : undefined;
  }

  if (typeof value === 'string') {
    const normalized = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    return normalized.length ? normalized : undefined;
  }

  return undefined;
}

function normalizeRow(row: Record<string, unknown>): ExcelRowInput {
  return excelRowSchema.parse({
    name: row.name ?? row.Name,
    price: row.price ?? row.Price,
    type: row.type ?? row.Type,
    stock: row.stock ?? row.Stock,
    image: row.image ?? row.Image,
    slug: row.slug ?? row.Slug,
    brand: row.brand ?? row.Brand,
    description: row.description ?? row.Description,
    longDescription: row.longDescription ?? row.LongDescription,
    packageGroup: row.packageGroup ?? row.PackageGroup,
    viscosity: row.viscosity ?? row.Viscosity,
    quantityUnit: row.quantityUnit ?? row.QuantityUnit,
    quantity: row.quantity ?? row.Quantity,
    bulkPrice: row.bulkPrice ?? row.BulkPrice,
    discount: row.discount ?? row.Discount,
    useCase: row.useCase ?? row.UseCase,
    sku: row.sku ?? row.Sku,
    featured: row.featured ?? row.Featured,
    active: row.active ?? row.Active,
  });
}

export function parseExcelProducts(buffer: Buffer): ExcelImportProduct[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  const productsBySlug = new Map<string, ExcelImportProduct>();

  rows.forEach((row) => {
    const parsedRow = normalizeRow(row);
    const slug = slugify(parsedRow.slug || parsedRow.name);
    const image = toStringOrUndefined(parsedRow.image) || '/drum_Oil.webp';
    const brand = toStringOrUndefined(parsedRow.brand) || parsedRow.name;
    const description = toStringOrUndefined(parsedRow.description) || `${parsedRow.name} product`;

    productsBySlug.set(slug, {
      name: parsedRow.name,
      slug,
      brand,
      description,
      longDescription: toStringOrUndefined(parsedRow.longDescription),
      packageGroup: toStringOrUndefined(parsedRow.packageGroup),
      type: parsedRow.type,
      viscosity: toStringOrUndefined(parsedRow.viscosity),
      quantityUnit: toStringOrUndefined(parsedRow.quantityUnit) || 'ml',
      price: parsedRow.price,
      bulkPrice: parsedRow.bulkPrice,
      discount: parsedRow.discount,
      quantity: parsedRow.quantity ?? 1,
      image,
      images: [image],
      vehicleTypes: toStringArray(row.vehicleTypes ?? row.VehicleTypes),
      useCase: toStringOrUndefined(parsedRow.useCase),
      benefits: toStringArray(row.benefits ?? row.Benefits),
      specifications: toStringArray(row.specifications ?? row.Specifications),
      compatibilityNotes: toStringArray(row.compatibilityNotes ?? row.CompatibilityNotes),
      recommendedKmRange: undefined,
      serviceIntervalKm: row.serviceIntervalKm ? Number(row.serviceIntervalKm) : undefined,
      stock: parsedRow.stock,
      sku: toStringOrUndefined(parsedRow.sku) || slug,
      featured: parsedRow.featured ?? false,
      active: parsedRow.active ?? true,
    });
  });

  return Array.from(productsBySlug.values());
}

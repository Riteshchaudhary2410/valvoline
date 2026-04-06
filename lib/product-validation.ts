import { z } from 'zod';
import { PRODUCT_TYPES } from '@/models/Product';

const trimmedText = z.string().trim().min(1);
const optionalTrimmedText = z.string().trim().min(1).optional();

const optionalStringArray = z.array(trimmedText).optional();

export const createProductSchema = z
  .object({
    name: trimmedText,
    slug: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-z0-9-]+$/, 'Slug must use lowercase letters, numbers, and hyphens only')
      .transform((value) => value.toLowerCase())
      .optional(),
    brand: optionalTrimmedText,
    description: optionalTrimmedText,
    longDescription: optionalTrimmedText,
    packageGroup: optionalTrimmedText,
    type: z.enum(PRODUCT_TYPES),
    viscosity: optionalTrimmedText,
    quantityUnit: trimmedText.optional(),
    price: z.number().nonnegative(),
    bulkPrice: z.number().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    quantity: z.number().int().nonnegative().optional(),
    image: trimmedText.optional(),
    images: optionalStringArray,
    vehicleTypes: optionalStringArray,
    useCase: optionalTrimmedText,
    benefits: optionalStringArray,
    specifications: optionalStringArray,
    compatibilityNotes: optionalStringArray,
    recommendedKmRange: z.tuple([z.number(), z.number()]).optional(),
    serviceIntervalKm: z.number().int().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
    sku: trimmedText.optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
  })
  .strict();

export const updateProductSchema = createProductSchema
  .partial()
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field is required for update',
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

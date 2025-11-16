import { z } from "zod";
import mongoIdSchema from "./mongoId-schema.js";
import urlSchema from "./url-schema.js";

const descriptionSchema = z.object({
  title: z
    .string()
    .trim()
    .max(50, "Title must be at most 50 characters.")
    .optional(),
  image: urlSchema.optional(),
  content: z
    .string()
    .max(200, "Content must be at most 200 characters.")
    .optional(),
});

const descriptionTabSchema = z.object({
  generalInformation: z
    .record(z.string().max(100).trim())
    .optional()
    .default({}),
  description: z
    .array(descriptionSchema)
    .max(5, "Description can have a maximum of 5 sections.")
    .optional()
    .default([]),
  mainFeature: z
    .array(
      z.string().max(50, "Each main feature must be <= 50 characters.").trim()
    )
    .max(10, "Main feature can have a maximum of 10 sections.")
    .optional()
    .default([]),
});

const specificationTabSchema = z.object({
  specs: z.record(z.string().max(200).trim()).optional().default({}),
});

const returnPolicyTabSchema = z.object({
  type: z.enum(["warranty", "garranty"]).optional(),
  duration: z
    .object({
      value: z.number().min(1).optional(),
      unit: z.enum(["day", "month", "year"]).optional(),
    })
    .optional(),
  policyRule: z.array(descriptionSchema).optional().default([]),
});

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, "Title must be at most 100 characters.")
    .optional(),
  price: z.number().min(0, "Price never less then 0").optional(),
  images: z
    .array(urlSchema)
    .max(5, "One product variant can have a maximum of 5 images")
    .optional(),
  productDetail: z
    .object({
      description: descriptionTabSchema.optional(),
      specification: specificationTabSchema.optional(),
      returnPolicy: returnPolicyTabSchema.optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  seo: z
    .object({
      metaTitle: z.string().trim().max(60).optional(),
      metaDescription: z.string().trim().max(160).optional(),
      keywords: z
        .array(z.string().max(20))
        .max(5, "one product variant have a maximum of 5 key words")
        .optional()
        .default([]),
    })
    .optional(),
  approvedBy: mongoIdSchema.optional(),
  category: mongoIdSchema.optional(),
  store: mongoIdSchema.optional(),
  brand: mongoIdSchema.optional(),
});

export const productVariantSchema = z.object({
  product: mongoIdSchema.optional(),
  skuId: z.string().optional(),
  attributes: z.record(z.string().trim()).optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  images: z
    .array(urlSchema)
    .max(5, "one product variant have a maximum of 5 images")
    .optional(),
  productDetail: z
    .object({
      description: descriptionTabSchema.optional(),
      specification: specificationTabSchema.optional(),
      returnPolicy: returnPolicyTabSchema.optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

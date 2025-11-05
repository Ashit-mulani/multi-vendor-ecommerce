import { z } from "zod";

export const attributeSchema = z.object({
  key: z.string().toLowerCase().optional(),
  type: z.enum(["string", "number", "boolean", "date"]).optional(),
  required: z.boolean().optional(),
  isFilterable: z.boolean().optional(),
  isVariant: z.boolean().optional(),
  allowedValues: z.array(z.any()).optional(),
});

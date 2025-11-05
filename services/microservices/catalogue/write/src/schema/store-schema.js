import { z } from "zod";
import mongoIdSchema from "./mongoId-schema.js";
import urlSchema from "./url-schema.js";

export const storeSchema = z.object({
  vendorId: mongoIdSchema.optional(),
  name: z.string().max(50, "store name most be 50 charectoar").optional(),
  description: z
    .string()
    .max(200, "store description most be 200 charectoar")
    .optional(),
  logo: urlSchema.optional(),
  banner: urlSchema.optional(),
  totalProducts: z.number().min(0).optional(),
});

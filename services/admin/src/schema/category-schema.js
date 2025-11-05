import { z } from "zod";
import { isValidObjectId } from "../utils/mongoId.js";

const mongoIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "Invalid ObjectId",
});

export const categorySchema = z.object({
  name: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  image: z.string().optional(),
  forProduct: z.boolean().optional(),
  allowedAttributes: z.array(mongoIdSchema).optional(),
  parent: mongoIdSchema.optional(),
});

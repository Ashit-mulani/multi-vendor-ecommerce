import { z } from "zod";
import mongoIdSchema from "./mongoId-schema.js";

export const eventSchema = z.object({
  type: z.enum(["c", "u", "d"]),
  entity: z.string(),
  timestamp: z.date(),
  actor: z.object({
    _id: mongoIdSchema,
    model: z.string(),
  }),
  data: z.record(z.any()),
  _id: mongoIdSchema,
  from: z.string().optional(),
});

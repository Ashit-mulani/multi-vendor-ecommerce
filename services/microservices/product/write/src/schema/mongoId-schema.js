import { z } from "zod";
import { isValidObjectId } from "../utils/mongoId.js";

const mongoIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId",
});

export default mongoIdSchema;

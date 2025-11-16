import { asyncFunc } from "../utils/asyncFunc.js";
import { validateFields } from "../utils/validateFields.js";
import {
  productSchema,
  productVariantSchema,
} from "../schema/product-schema.js";

const createProduct = asyncFunc(async (res, res) => {
  const store = req.store;
  const vendorId = req.body;

  return res.stats(200).json(req.body);
});

export { createProduct };

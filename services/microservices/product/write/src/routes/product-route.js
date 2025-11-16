import { Router } from "express";
import { storeAuth } from "../middleware/store-auth.js";
import { createProduct } from "../controllers/product-controller.js";

const productRouter = Router();

productRouter.route("/").post(storeAuth, createProduct);

export default productRouter;

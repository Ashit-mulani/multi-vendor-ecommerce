import { Router } from "express";
import { vendorAuth } from "../middlewares/vendor-auth.js";
import {
  createStore,
  deleteStore,
  updateStore,
  getStore,
  canStoreNameExist,
} from "../controllers/store-controller.js";

const storeRouter = Router();

storeRouter.route("/name/exist").get(canStoreNameExist);

storeRouter.route("/").post(vendorAuth, createStore);

storeRouter.route("/:storeId").put(vendorAuth, updateStore);

storeRouter.route("/:storeId").delete(vendorAuth, deleteStore);

storeRouter.route("/").get(vendorAuth, getStore);

export default storeRouter;

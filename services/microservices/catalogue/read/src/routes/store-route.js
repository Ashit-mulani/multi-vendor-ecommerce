import { Router } from "express";
import {
  canStoreNameExist,
  getStore,
} from "../controllers/store-controller.js";
import { storeAuth } from "../middleware/store-auth.js";

const storeRouter = Router();

storeRouter.route("/name/exist").get(canStoreNameExist);

storeRouter.route("/").get(storeAuth, getStore);

export default storeRouter;

import { Router } from "express";
import {
  createStore,
  updateStore,
  deleteStore,
} from "../controllers/store-controller.js";
import { storeAuth } from "../middleware/store-auth.js";

const storeRouter = Router();

storeRouter.route("/").post(createStore);

storeRouter.route("/:storeId").put(storeAuth, updateStore);

storeRouter.route("/:storeId").delete(storeAuth, deleteStore);

export default storeRouter;

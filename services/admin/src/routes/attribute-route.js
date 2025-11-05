import { Router } from "express";
import { adminAuth } from "../middleware/admin-auth.js";
import {
  checkCreateCategory,
  checkDeleteCategory,
  checkUpdateCategory,
} from "../middleware/permission/category-permission.js";
import {
  createAttribute,
  deleteAttribute,
  updatedAttribute,
} from "../controller/attribute-controlle.js";

const attributeRoute = Router();

attributeRoute
  .route("/create")
  .post(adminAuth, checkCreateCategory, createAttribute);

attributeRoute
  .route("/update/:attributeId")
  .put(adminAuth, checkUpdateCategory, updatedAttribute);

attributeRoute
  .route("/delete/:attributeId")
  .delete(adminAuth, checkDeleteCategory, deleteAttribute);

export default attributeRoute;

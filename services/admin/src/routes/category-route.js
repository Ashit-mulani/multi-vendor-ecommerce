import { Router } from "express";
import { adminAuth } from "../middleware/admin-auth.js";
import {
  checkCreateCategory,
  checkDeleteCategory,
  checkUpdateCategory,
} from "../middleware/permission/category-permission.js";
import {
  createCategory,
  deleteCategory,
  updatedCategory,
} from "../controller/category-controlle.js";

const categoryRoute = Router();

categoryRoute
  .route("/create")
  .post(adminAuth, checkCreateCategory, createCategory);

categoryRoute
  .route("/update/:categoryId")
  .put(adminAuth, checkUpdateCategory, updatedCategory);

categoryRoute
  .route("/delete/:categoryId")
  .delete(adminAuth, checkDeleteCategory, deleteCategory);

export default categoryRoute;

import { Router } from "express";
import {
  adminLogin,
  createAdmin,
  deleteAdmin,
  logout,
  me,
  refreshaApnaToken,
  updateAdmin,
} from "../controller/admin-control.js";
import { auth } from "../middleware/auth.js";
import { superAdminAuth } from "../middleware/super-admin-auth.js";
import { adminAuth } from "../middleware/admin-auth.js";

const adminRouter = Router();

adminRouter.route("/create").post(auth, superAdminAuth, createAdmin);

adminRouter.route("/update/:adminId").put(auth, superAdminAuth, updateAdmin);

adminRouter.route("/delete/:adminId").delete(auth, superAdminAuth, deleteAdmin);

adminRouter.route("/login").post(adminLogin);

adminRouter.route("/me").get(adminAuth, me);

adminRouter.route("/logout").put(adminAuth, logout);

adminRouter.route("/aapnatoken").get(adminAuth, refreshaApnaToken);

export default adminRouter;

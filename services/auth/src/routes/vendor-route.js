import { Router } from "express";
import { vendorAuth } from "../middleware/vendor-auth.js";
import {
  me,
  singup,
  updateUser,
  logOut,
  refreshvApnaToken,
} from "../controller/vendor-control.js";

const vendorRouter = Router();

vendorRouter.route("/me").get(vendorAuth, me);

vendorRouter.route("/singup").post(singup);

vendorRouter.route("/update").put(vendorAuth, updateUser);

vendorRouter.route("/logout").put(vendorAuth, logOut);

vendorRouter.route("/vapnatoken").get(vendorAuth, refreshvApnaToken);

export default vendorRouter;

import Admin from "@sakura-soft/common-admin-model";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import dotenv from "dotenv";

dotenv.config();

export const superAdminAuth = asyncFunc(async (req, _, next) => {
  const userId = req.user._id;

  const superAdmin = await Admin.findOne({
    _id: process.env.XWCID,
    userId,
    isSuperAdmin: true,
    departments: {
      $elemMatch: { name: "all", role: "superAdmin" },
    },
  });

  console.log(superAdmin);

  req.superAdmin = superAdmin;

  next();
});

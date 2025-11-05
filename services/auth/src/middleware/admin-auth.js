import jwt from "jsonwebtoken";
import Admin from "@sakura-soft/common-admin-model";
import { apiError } from "../utils/apiError.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { mongoId } from "../utils/mongoId.js";

export const adminAuth = asyncFunc(async (req, _, next) => {
  const aToken =
    req.cookies?.aToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!aToken) throw new apiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(aToken, process.env.aTOKEN_SECRET);

    const _id = mongoId(decoded._id);

    if (!_id) {
      throw new apiError(401, "Invalid Id");
    }

    const admin = await Admin.findById(_id).populate("userId", "email");

    if (!admin) {
      throw new apiError(403, "Admin account not found.");
    }

    if (!aToken == admin.aToken) {
      throw new apiError(401, "Invalid aToken");
    }

    req.admin = admin;

    next();
  } catch (err) {
    throw new apiError(401, "Invalid or expired aToken");
  }
});

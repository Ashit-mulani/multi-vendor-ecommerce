import jwt from "jsonwebtoken";
import Vendor from "@sakura-soft/common-vendor-model";
import { apiError } from "../utils/apiError.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { mongoId } from "../utils/mongoId.js";

export const vendorAuth = asyncFunc(async (req, _, next) => {
  const vToken =
    req.cookies?.vToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!vToken) throw new apiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(vToken, process.env.vTOKEN_SECRET);

    const _id = mongoId(decoded._id);

    if (!_id) {
      throw new apiError(401, "Invalid Id");
    }

    const vendor = await Vendor.findById(_id)
      .select("-devices -__v -updatedAt -createdAt")
      .populate("userId", "email");

    if (!vendor) {
      throw new apiError(403, "Vendor account not found.");
    }

    if (!vToken == vendor.vToken) {
      throw new apiError(401, "Invalid or expired vToken");
    }

    req.vendor = vendor;

    next();
  } catch (err) {
    throw new apiError(401, "Invalid or expired vToken");
  }
});

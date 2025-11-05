import jwt from "jsonwebtoken";
import User from "@sakura-soft/common-user-model";
import { apiError } from "../utils/apiError.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { mongoId } from "../utils/mongoId.js";

export const auth = asyncFunc(async (req, _, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const _id = mongoId(decoded._id);

    if (!_id) {
      throw new apiError(401, "Invalid Id");
    }

    const user = await User.findById(_id).select(
      "-password -devices -__v -updatedAt -createdAt -resetPasswordOtp -otp"
    );

    if (!user) {
      throw new apiError(401, "User not found");
    }

    if (!token == user.token) {
      throw new apiError(401, "Invalid token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new apiError(401, "Invalid token");
  }
});

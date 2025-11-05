import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { mongoId } from "../utils/mongoId.js";
import dotenv from "dotenv";

dotenv.config();

export const adminAuth = asyncFunc(async (req, res, next) => {
  const aApnaToken =
    req.cookies?.aApnaToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!aApnaToken) throw new apiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(aApnaToken, process.env.aACCESS_TOKEN_SECRET);

    const _id = mongoId(decoded._id);

    if (!_id) {
      throw new apiError(401, "Invalid Id");
    }

    req.admin = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    throw new apiError(401, "Invalid or expired aApnaToken", ["tokenEx"]);
  }
});

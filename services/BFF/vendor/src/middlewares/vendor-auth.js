import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncFunc } from "../utils/asyncFunc.js";

export const vendorAuth = asyncFunc(async (req, res, next) => {
  const vApnaToken =
    req.cookies?.vApnaToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!vApnaToken) throw new apiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(vApnaToken, process.env.vACCESS_TOKEN_SECRET);

    if (!decoded._id) {
      throw new apiError(401, "Invalid vendor Id");
    }

    req.vendor = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    throw new apiError(401, "Invalid or expired vApnaToken");
  }
});

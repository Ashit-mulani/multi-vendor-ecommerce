import { apiError } from "../utils/apiError.js";

export const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new apiError(401, "Unauthorized: Missing Bearer Token");
  }

  const apiKey = authHeader.split(" ")[1];
  if (apiKey !== process.env.NOTIFY_PASS_KEY) {
    throw new apiError(401, "Unauthorized: Invalid Pass key");
  }

  next();
};

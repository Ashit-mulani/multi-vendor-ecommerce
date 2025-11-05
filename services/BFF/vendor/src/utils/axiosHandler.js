import axios from "axios";
import { apiError } from "./apiError.js";

export const axiosHandler = async (config) => {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status || 500;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Catalogue service failed.";
      throw new apiError(status, message);
    } else if (error.request) {
      throw new apiError(
        503,
        "Catalogue service unavailable. Please try later."
      );
    } else {
      throw new apiError(500, "Internal BFF error.");
    }
  }
};

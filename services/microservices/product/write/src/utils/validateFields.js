import { apiError } from "./apiError.js";

export const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      throw new apiError(400, `${key} is required`);
    }
  }
  return true;
};

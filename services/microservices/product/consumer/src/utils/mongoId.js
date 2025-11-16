import mongoose from "mongoose";

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const isMongoId = (id) => {
  if (!isValidObjectId(id)) return null;
  return new mongoose.Types.ObjectId(id);
};

export function generateMongoId() {
  return new mongoose.Types.ObjectId().toString();
}

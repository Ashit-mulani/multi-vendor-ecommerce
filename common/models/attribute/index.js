import mongoose from "mongoose";

export const attributeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      toLowerCase: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["string", "number", "boolean", "date"],
      default: "string",
    },
    required: {
      type: Boolean,
      default: false,
    },
    isFilterable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVariant: {
      type: Boolean,
      default: false,
      index: true,
    },
    allowedValues: { type: [mongoose.Schema.Types.Mixed], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Attribute =
  mongoose.models.Attribute || mongoose.model("Attribute", attributeSchema);

export default Attribute;

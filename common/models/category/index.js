import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    image: {
      type: String,
    },
    forProduct: {
      type: Boolean,
      default: false,
      index: true,
    },
    allowedAttributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
      },
    ],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
      index: true,
    },
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

categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

categorySchema.pre("save", async function (next) {
  if (this.isModified("allowedAttributes")) {
    const attributeIds = this.allowedAttributes.map((id) => id.toString());
    const uniqueIds = new Set(attributeIds);
    if (uniqueIds.size !== attributeIds.length) {
      throw new Error("Duplicate attribute IDs found in allowedAttributes.");
    }
  }
  next();
});

categorySchema.index({ parent: 1, isActive: 1, forProduct: 1 });

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;

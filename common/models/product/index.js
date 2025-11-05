import mongoose from "mongoose";

const urlValidator = {
  validator: function (v) {
    return !v || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
  },
  message: (props) => `${props.value} is not a valid URL!`,
};

const descriptionSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    image: {
      type: String,
      trim: true,
      validate: urlValidator,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
  },
  { _id: false }
);

const descriptionTabSchema = new mongoose.Schema(
  {
    generalInformation: {
      type: Map,
      of: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      default: {},
    },
    description: {
      type: [descriptionSectionSchema],
      default: [],
      validate: {
        validator: (v) => v.length <= 5,
        message: "Description can have a maximum of 5 sections.",
      },
    },
    mainFeature: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (v) => v.length <= 10,
          message: "Main feature can have a maximum of 10 sections.",
        },
        {
          validator: (v) =>
            v.every((s) => typeof s === "string" && s.length <= 50),
          message: "Each main feature must be a string and <= 50 characters.",
        },
      ],
    },
  },
  { _id: false }
);

const specificationTabSchema = new mongoose.Schema(
  {
    specs: {
      type: Map,
      of: {
        type: String,
        maxlength: 200,
        trim: true,
      },
      default: {},
    },
  },
  { _id: false }
);

const returnPolicyTabSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["warranty", "garranty"],
    required: true,
  },
  duration: {
    value: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      enum: ["day", "month", "year"],
      required: true,
    },
  },
  policyRule: {
    type: [descriptionSectionSchema],
    default: [],
  },
});

export const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      validate: [
        {
          validator: (v) => v.length <= 5,
          message: "one product variant have a maximum of 5 images",
        },
        {
          validator: (v) =>
            v.every(
              (url) => typeof url === "string" && urlValidator.validator(url)
            ),
          message: "Each image must be a valid URL.",
        },
      ],
    },
    productDetail: {
      description: descriptionTabSchema,
      specification: specificationTabSchema,
      returnPolicy: returnPolicyTabSchema,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: 60,
        default: function () {
          return this.title ? `${this.title} | Buy Online at Best Price` : "";
        },
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: 160,
        default: function () {
          return this.title
            ? `${this.title} available now. Check features, specs, and best deals.`
            : "";
        },
      },
      keywords: {
        type: [String],
        default: [],
        validate: [
          {
            validator: (v) => v.length <= 5,
            message: "one product variant have a maximum of 5 key words",
          },
          {
            validator: (v) =>
              v.every((s) => typeof s === "string" && s.length <= 20),
            message: "Each keyword must be a max 20 characters.",
          },
        ],
      },
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;

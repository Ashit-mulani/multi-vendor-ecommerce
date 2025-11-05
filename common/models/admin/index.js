import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    departments: [
      {
        name: {
          type: String,
          required: true,
          enum: [
            "all",
            "category",
            "product",
            "order",
            "payment",
            "auth",
            "notification",
            "customercare",
          ],
        },
        role: {
          type: String,
          required: true,
          enum: [
            "superAdmin",
            "admin",
            "moderator",
            "manager",
            "viewer",
            "analytics",
          ],
        },
        permissions: {
          type: [String],
          required: true,
          enum: ["create", "update", "delete", "read"],
          default: ["read"],
        },
      },
    ],
    phoneNumbers: [
      {
        number: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
          enum: ["india"],
          default: "india",
        },
        isNumberVerified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    aToken: {
      type: String,
    },
  },
  { timestamps: true }
);

adminSchema.methods.generateaToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.aTOKEN_SECRET,
    {
      expiresIn: process.env.aTOKEN_EXPIRY || "5d",
    }
  );
};

adminSchema.methods.generateaAccessToken = async function () {
  if (!this.populated("userId")) {
    await this.populate("userId", "email userName");
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.userId.email,
      userName: this.userId.userName,
      isSuperAdmin: this.isSuperAdmin,
      departments: this.departments,
    },
    process.env.aACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;

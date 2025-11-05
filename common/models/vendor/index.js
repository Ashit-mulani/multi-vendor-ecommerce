import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const deviceSchema = new mongoose.Schema(
  {
    deviceType: String,
    os: String,
    browser: String,
    ipAddress: String,
    location: {},
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

export const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    phoneNumbers: [
      {
        number: {
          type: String,
          required: true,
        },
        isNumberVerified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    kycDetails: [
      {
        docName: {
          type: String,
          required: true,
        },
        docProof: {
          type: String,
          required: true,
        },
        isDocVerified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    devices: [deviceSchema],
    isVerified: {
      type: Boolean,
      default: false,
    },
    vToken: {
      type: String,
    },
  },
  { timestamps: true }
);

vendorSchema.methods.checkPhoneVerified = function () {
  return this.phoneNumbers.some((p) => p.isNumberVerified);
};

vendorSchema.methods.checkKycVerified = function () {
  return this.kycDetails.some((d) => d.isDocVerified);
};

vendorSchema.methods.checkVerification = function () {
  const phoneOk = this.checkPhoneVerified();
  const kycOk = this.checkKycVerified();

  return {
    phoneVerified: phoneOk,
    kycVerified: kycOk,
    isFullyVerified: phoneOk && kycOk,
  };
};

vendorSchema.methods.generatevToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.vTOKEN_SECRET,
    {
      expiresIn: process.env.vTOKEN_EXPIRY || "10d",
    }
  );
};

vendorSchema.methods.addOrUpdateDevice = async function (deviceInfo) {
  if (!this.populated("userId")) {
    await this.populate("userId", "email userName");
  }
  const existing = this.devices.find(
    (d) =>
      d.deviceType === deviceInfo.deviceType &&
      d.os === deviceInfo.os &&
      d.browser === deviceInfo.browser &&
      d.ipAddress === deviceInfo.ipAddress
  );

  if (existing) {
    existing.lastLogin = new Date();
  } else {
    this.devices.push(deviceInfo);
    const email = this.userId.email;
    const userName = this.userId.userName;
    return true;
  }

  await this.save();
};

vendorSchema.methods.generatevAccessToken = async function () {
  if (!this.populated("userId")) {
    await this.populate("userId", "email userName");
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.userId.email,
      userName: this.userId.userName,
    },
    process.env.vACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default Vendor;

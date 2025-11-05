import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

export const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    resetPasswordOtp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    devices: [deviceSchema],
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRY || "15d",
    }
  );
};

userSchema.methods.addOrUpdateDevice = async function (deviceInfo) {
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
    return true;
  }

  await this.save();
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

import Vendor from "@sakura-soft/common-vendor-model";
import User from "@sakura-soft/common-user-model";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { getvTokens } from "../utils/token.js";
import { cookieOption } from "../utils/cookieOption.js";
import jwt from "jsonwebtoken";

const me = asyncFunc(async (req, res) => {
  const vendor = req.vendor;

  const { vToken, accessToken } = await getvTokens(vendor._id);

  return res
    .status(200)
    .cookie("vToken", vToken, cookieOption())
    .cookie("vApnaToken", accessToken, cookieOption())
    .json(new apiRes(200, vendor, "vendor fetch successfully"));
});

const singup = asyncFunc(async (req, res) => {
  const { device } = req.body;

  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json(
      new apiRes(
        400,
        {
          redirect_url: `${process.env.CLIENT_URL}/auth/login?redirect=${process.env.CLIENT_VENDOR_URL}`,
        },
        "Need to login first."
      )
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(400).json(
      new apiRes(
        400,
        {
          redirect_url: `${process.env.CLIENT_URL}/auth/login?redirect=${process.env.CLIENT_VENDOR_URL}`,
        },
        "Session expired or invalid token"
      )
    );
  }

  const user = await User.findById(decoded._id);

  if (!user) throw new apiError(404, "User not found");

  let vendor = await Vendor.findOne({ userId: user._id });

  if (!vendor) {
    vendor = await Vendor.create({
      userId: user._id,
      vendorName: user.userName,
      profilePhoto: user.profilePhoto || "",
    });

    if (!vendor) throw new apiError(500, "Failed to create vendor account");
  }

  if (device) await vendor.addOrUpdateDevice(device);

  const { vToken, accessToken } = await getvTokens(vendor._id);

  const vendorObj = vendor.toObject();

  delete vendorObj.devices;

  delete vendorObj.kycDetails;

  delete vendorObj.createdAt;

  delete vendorObj.updatedAt;

  delete vendorObj.__v;

  return res
    .status(vendor.isNew ? 201 : 200)
    .cookie("vToken", vToken, cookieOption())
    .cookie("vApnaToken", accessToken, cookieOption())
    .json(
      new apiRes(
        vendor.isNew ? 201 : 200,
        vendorObj,
        vendor.isNew
          ? "Vendor account created"
          : "Vendor account already exists"
      )
    );
});

const updateUser = asyncFunc(async (req, res) => {
  const { vendorName, profilePhoto } = req.body;

  const vendor = req.vendor;

  if (vendorName) vendor.vendorName = vendorName;

  if (profilePhoto) vendor.profilePhoto = profilePhoto;

  await vendor.save();

  return res
    .status(200)
    .json(new apiRes(200, vendor, "vendor account updated successfully"));
});

const logOut = asyncFunc(async (req, res) => {
  const vendor = req.vendor;
  await Vendor.findByIdAndUpdate(vendor._id, {
    $set: {
      validateFieldsoken: undefined,
    },
  });
  return res
    .status(200)
    .clearCookie("vToken", cookieOption())
    .clearCookie("vApnaToken", cookieOption())
    .json(new apiRes(200, null, "Vendor logout successfully"));
});

const refreshvApnaToken = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;
  const { vToken, accessToken } = await getvTokens(vendorId);

  return res
    .status(200)
    .cookie("vToken", vToken, cookieOption())
    .cookie("vApnaToken", accessToken, cookieOption())
    .json({});
});

export { me, singup, updateUser, logOut, refreshvApnaToken };

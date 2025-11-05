import Admin from "@sakura-soft/common-admin-model";
import User from "@sakura-soft/common-user-model";
import Vendor from "@sakura-soft/common-vendor-model";
import { apiError } from "./apiError.js";

const getTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const token = await user.generateToken();
    const accessToken = await user.generateAccessToken();
    user.token = token;
    await user.save({
      validateBeforeSave: false,
    });
    return { token, accessToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating Tokens");
  }
};

const getvTokens = async (vendorId) => {
  try {
    const vendor = await Vendor.findById(vendorId);
    const vToken = await vendor.generatevToken();
    const accessToken = await vendor.generatevAccessToken();
    vendor.vToken = vToken;
    await vendor.save({
      validateBeforeSave: false,
    });
    return { vToken, accessToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating vTokens");
  }
};

const getaTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const aToken = await admin.generateaToken();
    const accessToken = await admin.generateaAccessToken();
    admin.aToken = aToken;
    await admin.save({
      validateBeforeSave: false,
    });
    return { aToken, accessToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating aTokens");
  }
};

export { getTokens, getvTokens, getaTokens };

import axios from "axios";
import User from "@sakura-soft/common-user-model";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { validateFields } from "../utils/validateFields.js";
import { getTokens } from "../utils/token.js";
import oauth2Client from "../config/google-oauth-client.js";
import { cookieOption } from "../utils/cookieOption.js";
import crypto from "crypto";
import { sendOtp, sendPassResetOtp } from "../service/sendEmail.js";

const me = asyncFunc(async (req, res) => {
  const user = req.user;

  const { token, accessToken } = await getTokens(user._id);

  return res
    .status(201)
    .cookie("token", token, cookieOption())
    .cookie("apnaToken", accessToken, cookieOption())
    .json(new apiRes(201, user, "user fetch successfully"));
});

const singup = asyncFunc(async (req, res) => {
  const { userName, email, password, device } = req.body;

  validateFields({ userName, email, password });

  const userExist = await User.findOne({ email }).select("-password");

  if (userExist) {
    throw new apiError(400, "User already exist with this email");
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();

  const otpExpiry = Date.now() + 5 * 60 * 1000;

  const user = await User.create({
    email,
    userName,
    password,
    otp: {
      code: otpCode,
      expiresAt: otpExpiry,
    },
    devices: device ? [device] : [],
  });

  try {
    await sendOtp(user.email, user.userName, otpCode);
  } catch (error) {
    throw new apiError(404, "Failed to send otp");
  }

  return res
    .status(201)
    .json(
      new apiRes(
        201,
        { email: user.email },
        "OTP sent to your email, please verify."
      )
    );
});

const verifyOtp = asyncFunc(async (req, res) => {
  const { email, otp } = req.body;

  validateFields({ email, otp });

  const user = await User.findOne({ email }).select(
    "-password -devices -createdAt -updatedAt -__v"
  );
  if (!user) {
    throw new apiError(404, "user not found!");
  }

  if (
    user.otp &&
    user.otp.code == otp &&
    user.otp.expiresAt &&
    new Date(user.otp.expiresAt) > new Date()
  ) {
  } else {
    throw new apiError(400, "Invalid or expired Otp");
  }

  const { token, accessToken } = await getTokens(user._id);

  user.otp = undefined;

  user.isVerified = true;

  user.token = token;

  await user.save();

  return res
    .status(201)
    .cookie("token", token, cookieOption())
    .cookie("apnaToken", accessToken, cookieOption())
    .json(new apiRes(201, user, "Email verified successfully"));
});

const login = asyncFunc(async (req, res) => {
  const { email, password, device } = req.body;

  validateFields({
    email,
    password,
  });

  const user = await User.findOne({ email }).select(
    "-createdAt -updatedAt -__v"
  );

  if (!user) {
    throw new apiError(404, "user not exist with this email");
  }

  if (user.provider === "google" && !user.password) {
    throw new apiError(
      400,
      "This account was created with Google. Please login with Google."
    );
  }

  const isPasswordMatch = await user.isPasswordCorrect(password);

  if (!isPasswordMatch) {
    throw new apiError(400, "Invalid password");
  }

  if (!user.isVerified) {
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp.code = otpCode;

    user.otp.expiresAt = otpExpiresAt;

    await user.save();

    await sendOtp(user.email, user.userName, otpCode);

    return res
      .status(200)
      .json(
        new apiRes(
          200,
          { isVerified: false, email: user?.email },
          "Verify your email using the OTP that we sent"
        )
      );
  }

  const { token, accessToken } = await getTokens(user._id);

  if (device) {
    await user.addOrUpdateDevice(device);
  }

  const userObj = user.toObject();

  delete userObj.devices;

  delete userObj.__v;

  delete userObj.password;

  return res
    .status(200)
    .cookie("token", token, cookieOption())
    .cookie("apnaToken", accessToken, cookieOption())
    .json(new apiRes(200, userObj, "Login successful"));
});

const singupWithGoogle = asyncFunc(async (req, res) => {
  const { code, device } = req.body;

  if (!code) throw new apiError(400, "Google login failed");

  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const { email, name, picture: profilePhoto } = userRes.data;

    let user = await User.findOne({ email }).select("-password");

    if (!user) {
      user = await User.create({
        userName: name,
        email,
        profilePhoto,
        provider: "google",
        isVerified: true,
        devices: device ? [device] : [],
      });
    } else {
      if (device) await user.addOrUpdateDevice(device);
    }

    const { token, accessToken } = await getTokens(user._id);

    const userObj = user.toObject();

    delete userObj.devices;

    delete userObj.__v;

    delete userObj.password;

    return res
      .status(200)
      .cookie("token", token, cookieOption())
      .cookie("apnaToken", accessToken, cookieOption())
      .json(new apiRes(201, userObj, "Google login success !"));
  } catch (err) {
    console.log(err);
    throw new apiError(500, "Google login failed !");
  }
});

const resetPasswordOtp = asyncFunc(async (req, res) => {
  const { email } = req.body;

  validateFields({ email });

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "user not exist with this email");
  }

  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.resetPasswordOtp.code = otpCode;
  user.resetPasswordOtp.expiresAt = otpExpiresAt;

  await user.save();

  try {
    await sendPassResetOtp(user.email, user.userName, otpCode);
  } catch (error) {
    throw new apiError(404, "Failed to send otp");
  }

  return res
    .status(200)
    .json(new apiRes(200, { email: user.email }, "otp sent successfully"));
});

const resetPassword = asyncFunc(async (req, res) => {
  const { email, password, otp } = req.body;

  validateFields({ email, password, otp });

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "user not exist with this email");
  }

  if (
    user.resetPasswordOtp &&
    user.resetPasswordOtp.code == otp &&
    user.resetPasswordOtp.expiresAt &&
    new Date(user.resetPasswordOtp.expiresAt) > new Date()
  ) {
  } else {
    throw new apiError(400, "Invalid or expired Otp");
  }

  user.password = password;

  user.resetPasswordOtp = undefined;

  await user.save();

  return res
    .status(200)
    .json(new apiRes(200, null, "password reset successfully"));
});

const updateUser = asyncFunc(async (req, res) => {
  const { userName } = req.body;

  const user = req.user;

  validateFields({ userName });

  user.userName = userName;

  await user.save();

  return res
    .status(201)
    .json(new apiRes(200, user, "user updated successfully"));
});

const logOut = asyncFunc(async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(user._id, {
    $set: {
      token: undefined,
    },
  });
  return res
    .status(200)
    .clearCookie("token", cookieOption())
    .clearCookie("apnaToken", cookieOption())
    .json(new apiRes(200, null, "User logout successfully"));
});

const refreshApnaToken = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { token, accessToken } = await getTokens(userId);

  return res
    .status(200)
    .cookie("token", token, cookieOption())
    .cookie("apnaToken", accessToken, cookieOption())
    .json({});
});

export {
  me,
  singup,
  verifyOtp,
  login,
  singupWithGoogle,
  resetPasswordOtp,
  resetPassword,
  updateUser,
  logOut,
  refreshApnaToken,
};

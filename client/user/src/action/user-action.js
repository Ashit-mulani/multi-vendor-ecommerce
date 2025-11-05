import { getDeviceInfo } from "@/hooks/utils-hooks/getDeviceInfo";
import authApi from "@/lib/api/auth-api";

export const getMe = async () => {
  try {
    const res = await authApi.get("/me");
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to get user";
    throw new Error(message);
  }
};

export const singUp = async (data) => {
  let device = {};
  try {
    device = await getDeviceInfo();
  } catch (error) {
    device = {};
  }
  try {
    const res = await authApi.post("/singup", { ...data, device });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to sign up";
    throw new Error(message);
  }
};

export const singUpWithGoogle = async (code) => {
  let device = {};
  try {
    device = await getDeviceInfo();
  } catch (error) {
    device = {};
  }
  try {
    const res = await authApi.post("/singup-with-google", { code, device });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to sign up with Google";
    throw new Error(message);
  }
};

export const verifyOtp = async (data) => {
  try {
    const res = await authApi.post("/verify", data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to verify OTP";
    throw new Error(message);
  }
};

export const login = async (data) => {
  let device = {};
  try {
    device = await getDeviceInfo();
  } catch (error) {
    device = {};
  }
  try {
    const res = await authApi.post("/login", { ...data, device });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to login";
    throw new Error(message);
  }
};

export const resetPassOtp = async (data) => {
  try {
    const res = await authApi.post("/reset-pass-otp", data);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to send reset password OTP";
    throw new Error(message);
  }
};

export const resetPass = async (data) => {
  try {
    const res = await authApi.post("/reset-pass", data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to reset password";
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const res = await authApi.put("/logout");
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to logout";
    throw new Error(message);
  }
};

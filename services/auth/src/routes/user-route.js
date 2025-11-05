import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
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
} from "../controller/user-control.js";

const userRouter = Router();

userRouter.route("/me").get(auth, me);

userRouter.route("/singup").post(singup);

userRouter.route("/verify").post(verifyOtp);

userRouter.route("/login").post(login);

userRouter.route("/singup-with-google").post(singupWithGoogle);

userRouter.route("/reset-pass-otp").post(resetPasswordOtp);

userRouter.route("/reset-pass").post(resetPassword);

userRouter.route("/update").put(auth, updateUser);

userRouter.route("/logout").put(auth, logOut);

userRouter.route("/apnatoken").get(auth, refreshApnaToken);

export default userRouter;

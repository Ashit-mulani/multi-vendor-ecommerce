import Admin from "@sakura-soft/common-admin-model";
import User from "@sakura-soft/common-user-model";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { validateFields } from "../utils/validateFields.js";
import { cookieOption } from "../utils/cookieOption.js";
import { getaTokens } from "../utils/token.js";

const me = asyncFunc(async (req, res) => {
  const admin = req.admin;

  const { aToken, accessToken } = await getaTokens(admin._id);

  return res
    .status(201)
    .cookie("aToken", aToken, cookieOption())
    .cookie("aApnaToken", accessToken, cookieOption())
    .json(new apiRes(201, admin, "admin fetch successfully"));
});

const createAdmin = asyncFunc(async (req, res) => {
  const superAdmin = req.superAdmin;

  const { userId, adminName, profilePhoto, departments, phoneNumbers } =
    req.body;

  validateFields({
    userId,
    adminName,
    departments,
    phoneNumbers,
  });

  const userExists = await User.findById(userId);

  if (!userExists) {
    throw new apiError(404, "User not found");
  }

  const existingAdmin = await Admin.findOne({ userId });

  if (existingAdmin) {
    throw new apiError(400, "This user is already an admin");
  }

  if (!Array.isArray(departments) || departments.length === 0) {
    throw new apiError(400, "At least one department is required");
  }

  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    throw new apiError(400, "At least one phone number is required");
  }

  const newAdmin = await Admin.create({
    userId,
    adminName,
    profilePhoto: profilePhoto || "",
    departments,
    phoneNumbers,
    createdBy: superAdmin.userId,
  });

  return res
    .status(201)
    .json(new apiRes(201, newAdmin, "Admin created successfully"));
});

const updateAdmin = asyncFunc(async (req, res) => {
  const superAdmin = req.superAdmin;

  const { adminId } = req.params;

  const { adminName, profilePhoto, departments, phoneNumbers } = req.body;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new apiError(404, "Admin not found");
  }

  if (!superAdmin || String(admin.createdBy) !== String(superAdmin.userId)) {
    throw new apiError(403, "Not authorized to update this admin");
  }

  if (adminName) admin.adminName = adminName;

  if (profilePhoto) admin.profilePhoto = profilePhoto;

  if (departments) {
    if (!Array.isArray(departments) || departments.length === 0) {
      throw new apiError(400, "Departments must be a non-empty array");
    }

    admin.departments = departments;
  }

  if (phoneNumbers) {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      throw new apiError(400, "Phone numbers must be a non-empty array");
    }

    admin.phoneNumbers = phoneNumbers;
  }

  const updatedAdmin = await admin.save();

  return res
    .status(200)
    .json(new apiRes(200, updatedAdmin, "Admin updated successfully"));
});

const deleteAdmin = asyncFunc(async (req, res) => {
  const superAdmin = req.superAdmin;

  const { adminId } = req.params;

  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new apiError(404, "Admin not found");
  }

  if (!superAdmin) {
    throw new apiError(403, "Only Super Admins can delete admins");
  }

  if (String(superAdmin._id) === String(admin._id)) {
    throw new apiError(400, "Super Admin cannot delete themselves");
  }

  if (admin.isSuperAdmin) {
    const count = await Admin.countDocuments({ isSuperAdmin: true });

    if (count <= 1) {
      throw new apiError(400, "Cannot delete the last Super Admin");
    }
  }

  await Admin.findByIdAndDelete(adminId);

  return res
    .status(200)
    .json(new apiRes(200, null, "Admin deleted successfully"));
});

const adminLogin = asyncFunc(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new apiError(404, "User not found");

  if (user.provider === "google" && !user.password) {
    throw new apiError(
      400,
      "This account was created with Google, Please reset password."
    );
  }

  const admin = await Admin.findOne({ userId: user._id }).populate(
    "userId",
    "email"
  );

  if (!admin) throw new apiError(403, "User is not an Admin");

  const isPasswordMatch = await user.isPasswordCorrect(password);

  if (!isPasswordMatch) {
    throw new apiError(400, "Invalid password");
  }

  const { aToken, accessToken } = await getaTokens(admin._id);

  return res
    .status(200)
    .cookie("aToken", aToken, cookieOption())
    .cookie("aApnaToken", accessToken, cookieOption())
    .json(new apiRes(200, admin, "admin login sucess"));
});

const logout = asyncFunc(async (req, res) => {
  const admin = req.admin;
  await Admin.findByIdAndUpdate(admin._id, {
    $set: {
      aToken: undefined,
    },
  });
  return res
    .status(200)
    .clearCookie("aToken", cookieOption())
    .clearCookie("aApnaToken", cookieOption())
    .json(new apiRes(200, null, "admin logout successfully"));
});

const refreshaApnaToken = asyncFunc(async (req, res) => {
  const adminId = req.admin._id;
  const { aToken, accessToken } = await getaTokens(adminId);

  return res
    .status(200)
    .cookie("aToken", aToken, cookieOption())
    .cookie("aApnaToken", accessToken, cookieOption())
    .json({});
});

export {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  adminLogin,
  me,
  logout,
  refreshaApnaToken,
};

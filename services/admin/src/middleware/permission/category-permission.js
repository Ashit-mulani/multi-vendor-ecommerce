import { apiError } from "../../utils/apiError.js";
import { asyncFunc } from "../../utils/asyncFunc.js";

export const checkCreateCategory = asyncFunc((req, _, next) => {
  const admin = req.admin;

  if (admin.isSuperAdmin) {
    return next();
  }
  const hasPermission = admin.departments.some(
    (dept) =>
      dept.name === "category" &&
      dept.permissions.includes("create") &&
      ["superAdmin", "admin", "moderator", "manager"].includes(dept.role)
  );

  if (!hasPermission) {
    throw new apiError(401, "You do not have permission to create categories");
  }

  next();
});

export const checkUpdateCategory = asyncFunc((req, _, next) => {
  const admin = req.admin;

  if (admin.isSuperAdmin) {
    return next();
  }
  const hasPermission = admin.departments.some(
    (dept) =>
      dept.name === "category" &&
      dept.permissions.includes("update") &&
      ["superAdmin", "admin", "moderator", "manager"].includes(dept.role)
  );

  if (!hasPermission) {
    throw new apiError(401, "You do not have permission to update categories");
  }

  next();
});

export const checkDeleteCategory = asyncFunc((req, _, next) => {
  const admin = req.admin;

  if (admin.isSuperAdmin) {
    return next();
  }
  const hasPermission = admin.departments.some(
    (dept) =>
      dept.name === "category" &&
      dept.permissions.includes("delete") &&
      ["superAdmin", "admin", "moderator", "manager"].includes(dept.role)
  );

  if (!hasPermission) {
    throw new apiError(401, "You do not have permission to delete categories");
  }

  next();
});

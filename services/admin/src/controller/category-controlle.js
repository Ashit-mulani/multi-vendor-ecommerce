import Category from "@sakura-soft/common-category-model";
import Attribute from "@sakura-soft/common-attribute-model";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { validateFields } from "../utils/validateFields.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { categorySchema } from "../schema/category-schema.js";
import { mongoId } from "../utils/mongoId.js";

const createCategory = asyncFunc(async (req, res) => {
  const admin = req.admin;

  const { name } = req.body;

  validateFields({ name });

  const result = categorySchema.safeParse(req.body);

  if (!result.success) {
    throw new apiError(
      400,
      result?.error?.issues?.map((e) => e.message).join(", ")
    );
  }

  const data = result.data;

  if (
    data.allowedAttributes &&
    Array.isArray(data.allowedAttributes) &&
    data.allowedAttributes.length > 0
  ) {
    const count = await Attribute.countDocuments({
      _id: { $in: data.allowedAttributes },
    });
    if (count !== data.allowedAttributes.length) {
      throw new apiError(400, "some attributes do not exist");
    }
  }

  if (data.parent) {
    const parent = await Category.findById(data.parent);
    if (!parent) {
      throw new apiError(400, "Parent category does not exist");
    }
  }

  const existing = await Category.findOne({ name: data.name });

  if (existing) {
    throw new apiError(400, "Category already exists");
  }

  const category = await Category.create({
    ...data,
    createdBy: admin._id,
  });

  if (!category) {
    throw new apiError(500, "failed to create category");
  }

  return res
    .status(200)
    .json(new apiRes(200, category, "category created successfully"));
});

const updatedCategory = asyncFunc(async (req, res) => {
  const admin = req.admin;

  const { categoryId } = req.params;

  const _id = mongoId(categoryId);

  if (!_id) {
    throw new apiError(400, "Invalied category id");
  }

  const result = categorySchema.safeParse(req.body);

  if (!result.success) {
    throw new apiError(
      400,
      result?.error?.issues?.map((e) => e.message).join(", ")
    );
  }

  const data = result.data;

  if (!data) {
    throw new apiError(400, "No data provided for update category");
  }

  if (
    data.allowedAttributes &&
    Array.isArray(data.allowedAttributes) &&
    data.allowedAttributes.length > 0
  ) {
    const count = await Attribute.countDocuments({
      _id: { $in: data.allowedAttributes },
    });
    if (count !== data.allowedAttributes.length) {
      throw new apiError(400, "some attributes do not exist");
    }
  }

  if (data.parent) {
    const parent = await Category.findById(data.parent);
    if (!parent) {
      throw new apiError(400, "Parent category does not exist");
    }
  }

  if (data.name) {
    const existing = await Category.findOne({
      name: data.name,
    });
    if (existing) {
      throw new apiError(400, "Category already exists");
    }
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      ...data,
      updatedBy: admin._id,
    },
    { new: true }
  );

  if (!category) {
    throw new apiError(404, "category not found or could not be updated");
  }

  return res
    .status(200)
    .json(new apiRes(200, category, "category updated successfully"));
});

const deleteCategory = asyncFunc(async (req, res) => {
  const { categoryId } = req.params;

  const _id = mongoId(categoryId);

  if (!_id) {
    throw new apiError(400, "Invalied category id");
  }

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new apiError(404, "category not found or could not be deleted");
  }

  return res
    .status(200)
    .json(new apiRes(200, null, "category deleted successfully"));
});

export { createCategory, updatedCategory, deleteCategory };

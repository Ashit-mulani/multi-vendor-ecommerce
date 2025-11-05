import Attribute from "@sakura-soft/common-attribute-model";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { mongoId } from "../utils/mongoId.js";
import { validateFields } from "../utils/validateFields.js";
import { attributeSchema } from "../schema/attribute-schema.js";

const createAttribute = asyncFunc(async (req, res) => {
  const admin = req.admin;

  const { key } = req.body;

  validateFields({ key });

  const result = attributeSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiError(
      400,
      result?.error?.issues?.map((e) => e.message).join(", ")
    );
  }

  const data = result.data;

  const existing = await Attribute.findOne({ key: data.key.toLowerCase() });

  if (existing) {
    throw new apiError(400, "Attribute key already exists");
  }

  const attribute = await Attribute.create({
    ...data,
    createdBy: admin._id,
  });

  if (!attribute) {
    throw new apiError(500, "failed to create attribute");
  }

  return res
    .status(200)
    .json(new apiRes(200, attribute, "Attribute created successfully"));
});

const updatedAttribute = asyncFunc(async (req, res) => {
  const admin = req.admin;

  const { attributeId } = req.params;

  const _id = mongoId(attributeId);

  if (!_id) {
    throw new apiError(400, "Invalied attribute id");
  }

  const result = attributeSchema.safeParse(req.body);

  if (!result.success) {
    throw new apiError(
      400,
      result?.error?.issues?.map((e) => e.message).join(", ")
    );
  }
  const data = result.data;

  if (!data) {
    throw new apiError(400, "No data provided for update attribute");
  }

  if (data.key) {
    const existing = await Attribute.findOne({
      key: data.key.toLocaleLowerCase(),
    });
    if (existing) {
      throw new apiError(
        400,
        "Another attribute with the same key already exists"
      );
    }
  }

  const updated = await Attribute.findByIdAndUpdate(
    attributeId,
    {
      ...data,
      updatedBy: admin._id,
    },
    { new: true }
  );

  if (!updated) {
    throw new apiError(404, "Attribute not found or could not be updated");
  }

  return res
    .status(200)
    .json(new apiRes(200, updated, "Attribute updated successfully"));
});

const deleteAttribute = asyncFunc(async (req, res) => {
  const { attributeId } = req.params;

  const _id = mongoId(attributeId);

  if (!_id) {
    throw new apiError(400, "Invalied attribute id");
  }

  const deletedAttribute = await Attribute.findByIdAndDelete(attributeId);

  if (!deletedAttribute) {
    throw new apiError(500, "Attribute not found or could not be deleted");
  }

  return res
    .status(200)
    .json(new apiRes(200, null, "attribute deleted successfully"));
});

export { createAttribute, updatedAttribute, deleteAttribute };

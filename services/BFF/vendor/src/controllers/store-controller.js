import { catalogueUrl } from "../config/urls/micro-url.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { validateFields } from "../utils/validateFields.js";
import { axiosHandler } from "../utils/axiosHandler.js";

const createStore = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;

  const result = await axiosHandler({
    method: "post",
    url: `${catalogueUrl}/store`,
    data: {
      ...req.body,
      vendorId,
    },
  });

  return res.status(200).json(result);
});

const updateStore = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;

  const storeId = req.params.storeId;

  validateFields({ storeId });

  const result = await axiosHandler({
    method: "put",
    url: `${catalogueUrl}/store/${storeId}`,
    data: {
      ...req.body,
      vendorId,
    },
  });

  return res.status(200).json(result);
});

const deleteStore = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;

  const { storeId } = req.params;

  validateFields({ storeId });

  const result = await axiosHandler({
    method: "delete",
    url: `${catalogueUrl}/store/${storeId}`,
    data: {
      vendorId,
    },
  });

  return res.status(200).json(result);
});

const getStore = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;

  const result = await axiosHandler({
    method: "get",
    url: `${catalogueUrl}/store`,
    data: { vendorId },
  });

  return res.status(200).json(result);
});

const canStoreNameExist = asyncFunc(async (req, res) => {
  const { name } = req.query;

  validateFields({ name });

  const result = await axiosHandler({
    method: "get",
    url: `${catalogueUrl}/store/name/exist?name=${encodeURIComponent(name)}`,
  });

  return res.status(200).json(result);
});

export { createStore, updateStore, deleteStore, getStore, canStoreNameExist };

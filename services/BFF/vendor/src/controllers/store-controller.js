import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { validateFields } from "../utils/validateFields.js";
import { axiosHandler } from "../utils/axiosHandler.js";
import { resolveService } from "../config/service-discovery.js";

const createStore = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;

  const baseUrl = await resolveService("catalogue-write-service");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/catalogue/api/v1/store`,
    data: {
      ...req.body,
      vendorId,
    },
  });

  return res.status(200).json(result, baseUrl);
});

const updateStore = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;

  const storeId = req.params.storeId;

  validateFields({ storeId });

  const baseUrl = await resolveService("catalogue-write-service");

  const result = await axiosHandler({
    method: "put",
    url: `${baseUrl}/catalogue/api/v1/store/${storeId}`,
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

  const baseUrl = await resolveService("catalogue-write-service");

  const result = await axiosHandler({
    method: "delete",
    url: `${baseUrl}/catalogue/api/v1/store/${storeId}`,
    data: {
      vendorId,
    },
  });

  return res.status(200).json(result);
});

const getStore = asyncFunc(async (req, res) => {
  const vendorId = req.vendor._id;

  const baseUrl = await resolveService("catalogue-read-service");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/catalogue/api/v1/store`,
    data: { vendorId },
  });

  return res.status(200).json(result);
});

const canStoreNameExist = asyncFunc(async (req, res) => {
  const { name } = req.query;

  validateFields({ name });

  const baseUrl = await resolveService("catalogue-read-service");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/catalogue/api/v1/store/name/exist?name=${encodeURIComponent(
      name
    )}`,
  });

  return res.status(200).json(result);
});

export { createStore, updateStore, deleteStore, getStore, canStoreNameExist };

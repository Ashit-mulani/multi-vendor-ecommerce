import Store from "@sakura-soft/common-store-model";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { redisGet, redisSet } from "../utils/safeRedis.js";
import { validateFields } from "../utils/validateFields.js";

const canStoreNameExist = asyncFunc(async (req, res) => {
  const { name } = req.query;

  validateFields({ name });

  const cached = await redisGet(`store-name:${name}`);

  if (cached !== null) {
    return res.json({ success: true, available: cached === "0" });
  }

  const store = await Store.findOne({ name }).lean();

  if (store) {
    await redisSet(`store-name:${store?.name}`, store ? "1" : "0");
  }

  return res.status(200).json(new apiRes(200, { available: !store }, "_ok"));
});

const getStore = asyncFunc(async (req, res) => {
  const store = req.store;
  return res.json(new apiRes(200, store, "store fetched successfully"));
});

export { getStore, canStoreNameExist };

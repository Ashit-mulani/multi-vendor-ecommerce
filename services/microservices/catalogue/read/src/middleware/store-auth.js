import { apiError } from "../utils/apiError.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { mongoId } from "../utils/mongoId.js";
import Store from "@sakura-soft/common-store-model";
import { redisGet, redisSet } from "../utils/safeRedis.js";

export const storeAuth = asyncFunc(async (req, res, next) => {
  const vendorId = req.body.vendorId;

  let store = await redisGet(`store:${vendorId}`);

  if (store && store.status == "deleted") {
    throw new apiError(404, "store not found");
  }

  if (!store) {
    store = await Store.findOne({ vendorId }).lean();

    if (!store) {
      throw new apiError(404, "store not found");
    }

    await redisSet(`store:${store.vendorId}`, store, 600);
  }

  if (!store.vendorId || store.vendorId.toString() !== vendorId.toString()) {
    throw new apiError(403, "Store does not belong to this vendor");
  }

  req.store = store;

  next();
});

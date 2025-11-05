import Store from "@sakura-soft/common-store-model";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { sendStoreEvent } from "../utils/produce-kafka-event.js";
import { validateFields } from "../utils/validateFields.js";
import { generateMongoId, mongoId } from "../utils/mongoId.js";
import { storeSchema } from "../schema/store-schema.js";
import { eventSchema } from "../schema/event-schema.js";
import logger from "../utils/logger.js";
import { redisDel, redisGet, redisSet } from "../utils/safeRedis.js";

const createStore = asyncFunc(async (req, res) => {
  const body = req.body;

  const vendorId = body.vendorId;

  // check required fileds
  validateFields({ vendorId, storeName: body.name });

  // validate mongo id
  const isId = mongoId(vendorId);

  if (!isId) {
    throw new apiError(400, "Invalid vendor id");
  }

  // redis key for store
  const cacheKey = `store:${vendorId}`;

  // get store data from redis and if exist then return
  const cachedStore = await redisGet(cacheKey);

  if (cachedStore && cachedStore.status != "deleted") {
    throw new apiError(400, "You already have a store.");
  }

  // check store name available from redis cache
  const cached = await redisGet(`store-name:${body.name}`);

  if (cached !== null) {
    throw new apiError(
      400,
      "A store with this name already exists. Store names must be unique."
    );
  }

  // final check for store from direct db
  const existing = await Store.findOne({
    $or: [{ vendorId }, { name: body.name }],
  }).lean();

  if (existing) {
    if (existing.vendorId.toString() === vendorId.toString()) {
      // if store exist then cache it
      await redisSet(cacheKey, existing, 600);
      throw new apiError(400, "You already have a store.");
    } else if (existing.name === body.name) {
      // name exist then cache it
      await redisSet(`store-name:${existing.name}`, existing ? "1" : "0");
      throw new apiError(
        400,
        "A store with this name already exists. Store names must be unique."
      );
    }
  }

  // zod's safe body parse
  const parsed = storeSchema.safeParse(body);

  if (!parsed.success) {
    throw new apiError(
      400,
      parsed?.error?.issues.map((m) => m.message).join(",")
    );
  }

  // generate mongo id for store
  const newId = generateMongoId();

  // zod's safe parse for the kafka event
  const parsedEvent = eventSchema.safeParse({
    type: "c",
    entity: "store",
    timestamp: new Date(),
    actor: { _id: vendorId, model: "Vendor" },
    data: {
      ...parsed.data,
    },
    _id: newId,
    from: "vendor-write-service",
  });

  if (!parsedEvent.success) {
    throw new apiError(500, "Store creation failed. Please try again.");
  }

  const event = parsedEvent.data;

  // send event to kafka
  try {
    await sendStoreEvent(event);
  } catch (error) {
    logger.warn(
      {
        error,
        topic: "vendor-store",
        type: "c",
        action: "produce-message",
      },
      "_F kafka produce message"
    );
    throw new apiError(500, "Store creation failed. Please try later.");
  }

  // cache the store data in redis to provide the user with an immediate response
  const storeCache = { ...event.data, _id: event._id };

  await redisSet(`store-name:${event.data.name}`, "1");

  const isSeted = await redisSet(cacheKey, storeCache);

  // send res base on redis set
  if (isSeted) {
    return res.json(new apiRes(202, storeCache, "Store created successfully."));
  } else {
    return res.json(
      new apiRes(
        202,
        null,
        "Store creation request queued, it may take some time."
      )
    );
  }
});

const updateStore = asyncFunc(async (req, res) => {
  const body = req.body;

  const store = req.store;

  const vendorId = body.vendorId;

  // zod's safe body parse
  const parsed = storeSchema.safeParse(body);

  if (!parsed.success) {
    throw new apiError(
      400,
      parsed?.error?.issues.map((m) => m.message).join(",")
    );
  }

  if (!parsed.data) {
    throw new apiError(400, "no data for store updated");
  }

  // if user want to updated store name check store name available.
  if (parsed.data.name) {
    const cached = await redisGet(`store-name:${parsed.data.name}`);

    if (cached !== null) {
      throw new apiError(
        400,
        "A store with this name already exists. Store names must be unique."
      );
    }

    const existing = await Store.findOne({
      name: parsed.data.name,
    }).lean();

    if (existing) {
      throw new apiError(
        400,
        "A store with this name already exists. Store names must be unique."
      );
    }
  }

  // full updated store
  const fullStore = {
    _id: store._id,
    name: parsed.data.name !== undefined ? parsed.data.name : store.name,
    description:
      parsed.data.description !== undefined
        ? parsed.data.description
        : store.description,
    logo: parsed.data.logo !== undefined ? parsed.data.logo : store.logo,
    banner:
      parsed.data.banner !== undefined ? parsed.data.banner : store.banner,
    vendorId,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };

  // zod's safe parse for the kafka event
  const parsedEvent = eventSchema.safeParse({
    type: "u",
    entity: "store",
    timestamp: new Date(),
    actor: {
      _id: vendorId,
      model: "Vendor",
    },
    _id: store._id,
    data: {
      ...parsed.data,
      vendorId,
    },
    from: "catalogue-write",
  });

  if (!parsedEvent.success) {
    throw new apiError(500, "Store update failed. Please try again.");
  }

  const event = parsedEvent.data;

  // send event to kafka
  try {
    await sendStoreEvent(event);
  } catch (error) {
    logger.warn(
      {
        error,
        topic: "vendor-store",
        type: "u",
        action: "produce-message",
      },
      "_F kafka produce message"
    );
    throw new apiError(500, "Store update failed. Please try later.");
  }

  // cache new name and delete old name cache from redis
  if (event.data.name) {
    await redisSet(`store-name:${event.data.name}`, "1");
    await redisDel(`store-name:${store.name}`);
  }

  // cache updated store data in redis to provide the user with an immediate response
  await redisSet(`store:${vendorId}`, fullStore);

  return res.json(new apiRes(200, fullStore, "Store updated successfully."));
});

const deleteStore = asyncFunc(async (req, res) => {
  const store = req.store;

  const vendorId = req.body.vendorId;

  // check if product inside store then not going to delete
  if (store.totalProducts > 0) {
    throw new apiError(400, "Store cannot be deleted because it has products.");
  }

  // zod's safe parse for the kafka event
  const parsedEvent = eventSchema.safeParse({
    type: "d",
    entity: "store",
    timestamp: new Date(),
    actor: { _id: vendorId, model: "Vendor" },
    data: {
      ...store,
    },
    _id: store._id,
    from: "catalogue-write",
  });

  if (!parsedEvent.success) {
    throw new apiError(500, "Store delete failed. Please try again.");
  }

  const event = parsedEvent.data;

  // send event to kafka
  try {
    await sendStoreEvent(event);
  } catch (error) {
    logger.warn(
      {
        error,
        topic: "vendor-store",
        type: "d",
        action: "produce-message",
      },
      "_F kafka produce message"
    );
    throw new apiError(500, "Store delete failed. Please try later.");
  }

  await redisSet(`store:${vendorId}`, { ...store, status: "deleted" });

  return res
    .status(200)
    .json(new apiRes(200, null, "Store deleted successfully"));
});

export { createStore, updateStore, deleteStore };

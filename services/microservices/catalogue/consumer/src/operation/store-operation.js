import Store from "@sakura-soft/common-store-model";
import { generateMongoId, isMongoId } from "../utils/mongoId.js";
import { getRedisClient } from "../config/redis-config.js";
import logger from "../utils/logger.js";
import { extractFailedDocs } from "../utils/extractFailedDocs.js";
import { storeBackupDbWrite } from "../utils/storeOutboxWrite.js";

const redis = getRedisClient("main");

let buffer = [];
let updateBuffer = [];
let deleteBuffer = [];
const BATCH_SIZE = 5000;
const FLUSH_INTERVAL = 3000;

const flushBuffer = async () => {
  if (buffer.length === 0) return;

  const batch = buffer.splice(0, BATCH_SIZE).map((s) => {
    return {
      ...s,
      _id: s._id ? isMongoId(s._id) : generateMongoId(),
    };
  });

  try {
    await Store.insertMany(batch, { ordered: false });
  } catch (error) {
    const failedDocs = extractFailedDocs(error, batch);
    await storeBackupDbWrite(failedDocs, "c", "db-write", error);
  } finally {
    try {
      const multi = redis.multi();
      for (const store of batch) {
        multi.expire(`store:${store.vendorId}`, 600);
      }
      await multi.exec();
    } catch (error) {
      let keys;
      for (const store of batch) {
        keys = `store:${store.vendorId}`;
      }
      logger.warn(
        {
          error,
          action: "redis-expire",
          key: keys || {},
          entity: "store",
        },
        "_F  Redis EXPIRE failed"
      );
    }
  }
};

const flushUpdateBuffer = async () => {
  if (updateBuffer.length === 0) return;

  const batch = updateBuffer.splice(0, BATCH_SIZE);

  const bulkOps = batch.map((s) => ({
    updateOne: {
      filter: { _id: s._id },
      update: {
        $set: {
          ...s,
        },
      },
      upsert: false,
    },
  }));

  try {
    await Store.bulkWrite(bulkOps, { ordered: false });
  } catch (error) {
    const failedDocs = extractFailedDocs(error, batch, "u", "db-update");
    await storeBackupDbWrite(failedDocs, "u", "db-update", error);
  } finally {
    try {
      const multi = redis.multi();
      for (const store of batch) {
        multi.expire(`store:${store.vendorId}`, 600);
      }
      await multi.exec();
    } catch (error) {
      let keys;
      for (const store of batch) {
        keys = `store:${store.vendorId}`;
      }
      logger.warn(
        {
          error,
          action: "redis-expire",
          key: keys || {},
          entity: "store",
        },
        "_F  Redis EXPIRE failed"
      );
    }
  }
};

const flushDeleteBuffer = async () => {
  if (deleteBuffer.length === 0) return;

  const batch = deleteBuffer.splice(0, BATCH_SIZE);

  try {
    const bulkOps = batch.map((s) => ({
      deleteOne: {
        filter: { _id: s._id },
      },
    }));

    await Store.bulkWrite(bulkOps, { ordered: false });
  } catch (error) {
    const failedDocs = extractFailedDocs(error, batch, "d", "db-delete");
    await storeBackupDbWrite(failedDocs, "d", "db-delete", error);
  } finally {
    try {
      const multi = redis.multi();
      for (const store of batch) {
        multi.del(`store:${store.vendorId}`);
        multi.del(`store-name:${store.name}`);
      }
      await multi.exec();
    } catch (redisErr) {
      const keys = batch.map((store) => `store:${store.vendorId}`);
      const nameKeys = batch.map((store) => `store-name:${store.name}`);
      logger.warn(
        {
          error: redisErr,
          action: "redis-del",
          keys,
          nameKeys,
          entity: "store",
        },
        "_F  Redis DEL failed"
      );
    }
  }
};

setInterval(flushUpdateBuffer, FLUSH_INTERVAL);
setInterval(flushBuffer, FLUSH_INTERVAL);
setInterval(flushDeleteBuffer, FLUSH_INTERVAL);

export const storeBulkInsert = async (events) => {
  if (!Array.isArray(events)) {
    events = [events];
  }
  buffer.push(...events);
};

export const storeBulkUpdate = async (events) => {
  if (!Array.isArray(events)) {
    events = [events];
  }
  updateBuffer.push(...events);
};

export const storeBulkDelete = async (events) => {
  if (!Array.isArray(events)) {
    events = [events];
  }
  deleteBuffer.push(...events);
};

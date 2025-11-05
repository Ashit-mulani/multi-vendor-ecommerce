import mongoose from "mongoose";
import Outbox from "@sakura-soft/common-outbox-model";
import ConnectMainDB from "../db/catalogue-db.js";
import logger from "../utils/logger.js";

const BATCH_SIZE = 1000;
const RETRY_LIMIT = 5;

const syncBackupToMain = async () => {
  try {
    const mainDB = await ConnectMainDB();
    const backupSession = await mongoose.startSession();
    backupSession.startTransaction();

    // 1. Fetch pending items
    const pendingDocs = await Outbox.find({
      status: "pending",
      retryCount: { $lt: RETRY_LIMIT },
    })
      .sort({ createdAt: 1 })
      .limit(BATCH_SIZE)
      .lean();

    if (!pendingDocs.length) {
      await backupSession.commitTransaction();
      backupSession.endSession();
      logger.trace("No pending backup docs found");
      return;
    }

    logger.info(`Found ${pendingDocs.length} docs to sync`);

    // 2. Group by entity type to write into proper collections
    const grouped = pendingDocs.reduce((acc, doc) => {
      if (!acc[doc.entity]) acc[doc.entity] = [];
      acc[doc.entity].push(doc);
      return acc;
    }, {});

    // 3. Process each entity in bulk
    for (const [entity, docs] of Object.entries(grouped)) {
      const mainModel = mainDB.model(entity); // dynamically get the model name

      // Prepare bulk operations
      const ops = docs.map((d) => {
        if (d.type === "c") {
          return {
            updateOne: {
              filter: { _id: d.data._id },
              update: { $setOnInsert: d.data },
              upsert: true,
            },
          };
        } else if (d.type === "u") {
          return {
            updateOne: {
              filter: { _id: d.data._id },
              update: { $set: d.data },
            },
          };
        } else if (d.type === "d") {
          return {
            deleteOne: { filter: { _id: d.data._id } },
          };
        }
      });

      // Run bulk write on main DB
      try {
        await mainModel.bulkWrite(ops);
        // Mark success
        const ids = docs.map((d) => d._id);
        await Outbox.updateMany(
          { _id: { $in: ids } },
          { $set: { status: "sent", sentAt: new Date() } }
        );
      } catch (err) {
        logger.error({ entity, err }, "Bulk write failed");
        // Mark failed + increment retryCount
        const ids = docs.map((d) => d._id);
        await Outbox.updateMany(
          { _id: { $in: ids } },
          {
            $set: { status: "failed", lastError: err.message },
            $inc: { retryCount: 1 },
          }
        );
      }
    }

    await backupSession.commitTransaction();
    backupSession.endSession();
    logger.info("Sync cycle completed ✅");
  } catch (error) {
    logger.error({ error }, "Backup sync failed");
  }
};

export default syncBackupToMain;

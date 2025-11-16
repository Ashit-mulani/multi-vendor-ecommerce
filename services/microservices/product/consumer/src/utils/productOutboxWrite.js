import logger from "./logger.js";
import { outboxSchema } from "@sakura-soft/common-outbox-model";
import ConnectBackupDB from "../db/backup-db.js";

let OutboxModel;

const getOutboxModel = async () => {
  if (!OutboxModel) {
    const conn = await ConnectBackupDB();
    OutboxModel = conn.model("Outbox", outboxSchema);
  }
  return OutboxModel;
};

export const productBackupDbWrite = async (
  failedDocs,
  type = "c",
  action = "db-write",
  error
) => {
  if (!failedDocs?.length) return;

  logger.warn(
    {
      error,
      type,
      topic: "vendor-product",
      action,
      failedDocs,
      count: failedDocs.length,
      entity: "product",
    },
    "_F DB write failed — retrying via Backup..."
  );

  const backupEntries = failedDocs.map((doc) => ({
    for: "product",
    type,
    entity: "Product",
    actor: {
      id: doc.vendorId || null,
      model: "Vendor",
    },
    from: "product-event-consumer",
    data: doc,
    status: "pending",
  }));

  try {
    const backup = await getOutboxModel();
    const backupDocs = await backup.insertMany(backupEntries, {
      ordered: false,
    });

    logger.info(
      {
        type,
        count: backupDocs.length,
        action: "backup-write",
        entity: "product",
      },
      "_I Failed docs saved into backup Db for retry"
    );

    if (failedDocs.length !== backupDocs.length) {
      const insertedIds = new Set(backupDocs.map((o) => String(o.data._id)));
      const notInsertedDocs = failedDocs.filter(
        (doc) => !insertedIds.has(String(doc._id))
      );

      logger.warn(
        {
          type,
          action: "backup-write",
          failedDocs: notInsertedDocs,
          entity: "product",
        },
        "_F Some backup entries were not inserted"
      );
    }
  } catch (backupError) {
    if (backupError.code === 11000) {
      logger.info("_I Duplicate backup entries ignored (already exists)");
    } else {
      logger.error(
        {
          error: backupError,
          topic: "vendor-store",
          type,
          action: "backup-write",
          entity: "product",
        },
        "_E backup db write failed"
      );
    }
  }
};

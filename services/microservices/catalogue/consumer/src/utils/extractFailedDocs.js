import logger from "./logger.js";

export function extractFailedDocs(
  error,
  batch,
  type = "c",
  action = "db-write"
) {
  let failedDocs = [];

  try {
    if (Array.isArray(error.writeErrors) && error.writeErrors.length > 0) {
      failedDocs = error.writeErrors
        .filter((e) => e?.err?.code !== 11000)
        .map((e) => batch[e.index]);
    } else if (error?.code === 11000) {
      const keyField = Object.keys(error.keyPattern || {})[0];
      const keyValue = keyField ? error.keyValue[keyField] : undefined;

      logger.info(
        {
          error,
          type,
          action,
          batchCount: batch?.length,
          keyField,
          keyValue,
          entity: "store",
        },
        "_I Duplicate key detected, skipping retry for single doc"
      );
    } else if (error?.op) {
      failedDocs.push(error.op);
    } else {
      logger.error(
        {
          error,
          type,
          action,
          batchCount: batch?.length,
          entity: "store",
        },
        "_E Could not extract failed docs,"
      );
    }
  } catch (parseErr) {
    logger.error(
      {
        error: error,
        parseError: parseErr,
        action: "extract-failed-docs",
        entity: "store",
        type,
        batchCount: batch?.length,
      },
      "_E Unexpected error parsing bulk insert failure"
    );
  }
  return failedDocs;
}

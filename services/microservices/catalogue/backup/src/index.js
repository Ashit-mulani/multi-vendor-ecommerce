import app from "./app.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import ConnectDB from "./db/db.js";
import syncBackupToMain from "./worker/backup-worker.js";

dotenv.config();

const startServer = async () => {
  try {
    await ConnectDB();
    let isRunning = false;

    setInterval(async () => {
      if (isRunning) return;
      isRunning = true;

      try {
        await syncBackupToMain();
      } catch (err) {
        logger.error({ err }, "Sync cycle failed");
      } finally {
        isRunning = false;
      }
    }, 60_000);

    app.listen(6021, () => {
      logger.trace(`_ok catalog backup DB worker 6031`);
    });
  } catch (error) {
    logger.fatal({ error }, "_F catalog backup DB worker 6031");
    process.exit(1);
  }
};

// startServer();

import app from "./app.js";
import dotenv from "dotenv";
import ConnectDB from "./db/db.js";
import logger from "./utils/logger.js";

dotenv.config();

const startServer = async () => {
  try {
    await ConnectDB();
    app.listen(8002, () => {
      logger.trace(`_ok services/admin-service-8002`);
    });
  } catch (error) {
    logger.fatal({ error }, "_F services/admin-service");
    process.exit(1);
  }
};

startServer();

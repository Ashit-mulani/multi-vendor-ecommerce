import app from "./app.js";
import { startKafka } from "./service/kafka.js";
import ConnectDB from "./db/db.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config();

const startServer = async () => {
  try {
    await ConnectDB();
    await startKafka();
    app.listen(6021, () => {
      logger.trace(`_ok catalog consumer 6021`);
    });
  } catch (error) {
    logger.fatal({ error }, "_F catalog consumer 6021");
    process.exit(1);
  }
};

startServer();

import app from "./app.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
import ConnectDB from "./db/db.js";
import { startKafka } from "./service/kafka.js";

dotenv.config();

const startServer = async () => {
  await ConnectDB();
  await startKafka();
  app.listen(6002, () => logger.trace("_ok product write 6002"));
};

startServer();

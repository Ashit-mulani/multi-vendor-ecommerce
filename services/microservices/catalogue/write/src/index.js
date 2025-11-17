import app from "./app.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
import ConnectDB from "./db/db.js";
import { startKafka } from "./service/kafka.js";
import registerWithConsul from "./config/consul-config.js";

dotenv.config();

const startServer = async () => {
  await ConnectDB();
  await startKafka();
  app.listen(
    6001,
    () => (registerWithConsul(6001), logger.trace("_ok catalogue write 6001"))
  );
};

startServer();

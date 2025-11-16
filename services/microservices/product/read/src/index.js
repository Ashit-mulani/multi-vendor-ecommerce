import app from "./app.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
import ConnectDB from "./db/db.js";

dotenv.config();

const startServer = async () => {
  await ConnectDB();
  app.listen(6012, () => logger.trace("_ok product read 6012"));
};

startServer();

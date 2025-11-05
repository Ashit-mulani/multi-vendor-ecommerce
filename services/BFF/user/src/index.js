import app from "./app.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config();

const startServer = async () => {
  app.listen(5001, () => {
    logger.trace("_ok user BFF");
  });
};

startServer();

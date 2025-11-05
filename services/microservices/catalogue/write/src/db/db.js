import mongoose from "mongoose";
import logger from "../utils/logger.js";

const ConnectDB = async () => {
  const mongoUrl = `${process.env.CATALOGUE_DB_URL}`;
  let connected = false;

  while (!connected) {
    try {
      await mongoose.connect(mongoUrl);
      connected = true;
    } catch (error) {
      logger.warn({ error }, "_DB retry_ connect to catalogue database failed");
      await new Promise((res) => setTimeout(res, 10000));
    }
  }
  logger.trace("_DB connected to catalogue database");
};

export default ConnectDB;

import mongoose from "mongoose";
import logger from "../utils/logger.js";

const ConnectDB = async () => {
  const mongoUrl = `${process.env.AUTH_DB_URL}`;
  let connected = false;

  while (!connected) {
    try {
      await mongoose.connect(mongoUrl);
      connected = true;
    } catch (err) {
      logger.warn("_DB retry_");
      await new Promise((res) => setTimeout(res, 10000));
    }
  }
};

export default ConnectDB;

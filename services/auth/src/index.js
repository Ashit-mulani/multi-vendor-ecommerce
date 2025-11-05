import app from "./app.js";
import dotenv from "dotenv";
import ConnectDB from "./db/db.js";
import logger from "./utils/logger.js";
dotenv.config();

ConnectDB()
  .then(() => {
    app.listen(8000, () => logger.trace("_ok services/auth-service-8000"));
  })
  .catch((error) => {
    logger.error({ error }, "_F services/auth-service");
    process.exit(1);
  });

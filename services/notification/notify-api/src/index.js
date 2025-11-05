import app from "./app.js";
import { startKafka } from "./service/kafka.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config();

startKafka()
  .then(() => {
    app.listen(7000, () => {
      logger.trace("_ok services/notification-service/notify-api-7000");
    });
  })
  .catch((error) => {
    logger.fatal({ error }, "_F services/notification-service/notify-api");
    process.exit(1);
  });

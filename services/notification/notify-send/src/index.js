import app from "./app.js";
import dotenv from "dotenv";
import startEmailWorker from "./worker/email-worker.js";
import logger from "./utils/logger.js";

dotenv.config();

startEmailWorker()
  .then(() =>
    app.listen(7002, () => {
      logger.trace("_ok services/notification-service/notify-send-7002");
    })
  )
  .catch((error) => {
    console.log(error);
    logger.fatal({ error }, "_F services/notification-service/notify-send");
    process.exit(1);
  });

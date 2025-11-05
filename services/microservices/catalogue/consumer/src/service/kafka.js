import { KafkaConfig } from "../config/kafka-config.js";
import dotenv from "dotenv";
import {
  storeBulkInsert,
  storeBulkUpdate,
  storeBulkDelete,
} from "../operation/store-operation.js";
import logger from "../utils/logger.js";

dotenv.config();

const storeHandlers = {
  c: storeBulkInsert,
  u: storeBulkUpdate,
  d: storeBulkDelete,
};

const storeKafka = new KafkaConfig(
  [process.env.KAFKA_BROKER],
  "vendor-store-event-consumer"
);

export const startKafka = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      await Promise.all([storeKafka.connectConsumer()]);

      await Promise.all([
        storeKafka.subscribeAndRun("vendor-store", storeHandlers),
      ]);
      return;
    } catch (error) {
      retries--;
      logger.warn({ error, retries }, "Kafka connection failed, retrying...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("❌ Kafka connection failed at consumer");
};

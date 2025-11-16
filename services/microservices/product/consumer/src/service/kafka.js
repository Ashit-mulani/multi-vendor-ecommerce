import { KafkaConfig } from "../config/kafka-config.js";
import dotenv from "dotenv";
import {
  productBulkDelete,
  productBulkInsert,
  productBulkUpdate,
} from "../operation/product-operation.js";
import logger from "../utils/logger.js";

dotenv.config();

const productHandlers = {
  c: productBulkInsert,
  u: productBulkUpdate,
  d: productBulkDelete,
};

const productKafka = new KafkaConfig(
  [process.env.KAFKA_BROKER],
  "product-event-consumer"
);

export const startKafka = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      await Promise.all([productKafka.connectConsumer()]);

      await Promise.all([
        productKafka.subscribeAndRun("vendor-product", productHandlers),
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

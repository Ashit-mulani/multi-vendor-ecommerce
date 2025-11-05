import { KafkaConfig } from "../config/kafka-config.js";
import dotenv from "dotenv";
import { processEmailEvent } from "../queue/email-notification-queue.js";

dotenv.config();

export const kafka = new KafkaConfig(
  [process.env.KAFKA_BROKER],
  "notification-consumer-group"
);

export const startKafka = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      await kafka.connectConsumer();

      await kafka.subscribeAndRun("email-notification", processEmailEvent);
      return;
    } catch (error) {
      retries--;
      logger.warn({ error, retries }, "Kafka connection failed, retrying...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("❌ Kafka connection failed at consumer");
};

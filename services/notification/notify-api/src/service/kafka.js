import { KafkaConfig } from "../config/kafka-config.js";
import dotenv from "dotenv";

dotenv.config();

export const kafka = new KafkaConfig([process.env.KAFKA_BROKER]);

export const startKafka = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      await kafka.connect();
      const topics = ["email-notification"];
      for (const topic of topics) {
        await kafka.createTopics(topic);
      }
      return;
    } catch (error) {
      retries--;
      logger.warn({ error, retries }, "Kafka connection failed, retrying...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("❌ Kafka connection failed");
};

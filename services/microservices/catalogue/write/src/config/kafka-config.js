import pkg, { logLevel } from "kafkajs";
import logger from "../utils/logger.js";

const { Kafka } = pkg;

export class KafkaConfig {
  constructor(brokers = []) {
    this.kafka = new Kafka({
      clientId: "auth-notification-producer",
      brokers: brokers,
      logLevel: logLevel.NOTHING,
      logCreator: () => () => {},
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.admin.connect();
    } catch (error) {
      logger.error({ error }, "_F kafka connect");
    }
  }

  async createTopics(topic) {
    try {
      const topicExist = await this.admin.listTopics();
      if (!topicExist.includes(topic)) {
        await this.admin.createTopics({
          topics: [
            {
              topic,
              numPartitions: 1,
              replicationFactor: 1,
            },
          ],
        });
      }
    } catch (error) {
      logger.error({ error }, "_F kafka create topic");
    }
  }

  async produceMessage(topic, messages = []) {
    try {
      await this.producer.send({
        topic,
        messages,
      });
    } catch (error) {
      // optional: send to retry queue / DLQ
      logger.error({ error }, "_F kafka produce message");
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.admin.disconnect();
    } catch (error) {
      logger.error({ error }, "_F kafka disconnect");
    }
  }
}

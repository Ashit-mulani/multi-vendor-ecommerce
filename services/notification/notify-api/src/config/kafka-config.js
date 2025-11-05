import pkg from "kafkajs";

const { Kafka } = pkg;

export class KafkaConfig {
  constructor(brokers = []) {
    this.kafka = new Kafka({
      clientId: "auth-notification-producer",
      brokers: brokers,
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.admin.connect();
    } catch (error) {}
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
    } catch (error) {}
  }

  async produceMessage(topic, messages = []) {
    try {
      await this.producer.send({
        topic,
        messages,
      });
    } catch (error) {
      // optional: send to retry queue / DLQ
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.admin.disconnect();
    } catch (error) {}
  }
}

import pkg from "kafkajs";
const { Kafka } = pkg;

export class KafkaConfig {
  constructor(brokers = [], groupId = "default-group") {
    this.kafka = new Kafka({
      clientId: "email-consumer-service",
      brokers,
    });
    this.consumer = this.kafka.consumer({ groupId });
  }

  async connectConsumer() {
    await this.consumer.connect();
  }

  async subscribeAndRun(topic, onMessage) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        await onMessage(data);
      },
    });
  }
}

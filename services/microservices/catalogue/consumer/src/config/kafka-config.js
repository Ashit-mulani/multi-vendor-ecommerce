// config/kafka-config.js
import pkg, { logLevel } from "kafkajs";
import logger from "../utils/logger.js";
const { Kafka } = pkg;

export class KafkaConfig {
  constructor(brokers = [], groupId = "default-group") {
    this.kafka = new Kafka({
      clientId: "vendor-event-consumer-service",
      brokers,
      logLevel: logLevel.NOTHING,
      logCreator: () => () => {},
    });
    this.consumer = this.kafka.consumer({ groupId });
  }

  async connectConsumer() {
    await this.consumer.connect();
  }

  async subscribeAndRun(topic, handlersMap = {}) {
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachBatchAutoResolve: false,
      eachBatch: async ({
        batch,
        resolveOffset,
        heartbeat,
        commitOffsetsIfNecessary,
        isRunning,
        isStale,
      }) => {
        if (!isRunning() || isStale()) return;

        const events = [];

        for (let message of batch.messages) {
          try {
            const data = JSON.parse(message.value.toString());
            events.push({ topic: batch.topic, data });
            resolveOffset(message.offset);
          } catch (err) {
            // optional: retry to parse
          }
        }

        if (events.length > 0) {
          try {
            for (const event of events) {
              const handler = handlersMap[event.data.type];
              if (handler) {
                await handler({
                  ...event.data?.data,
                  _id: event.data._id,
                });
              } else {
                logger.warn(`⚠️ No handler for type: ${event.data.type}`);
              }
            }
          } catch (err) {
            // optional: send to retry queue / DLQ
          }
        }

        await commitOffsetsIfNecessary();
        await heartbeat();
      },
    });
  }
}

import { Queue } from "bullmq";
import logger from "../utils/logger.js";
import { getRedisClient } from "../config/redis-config.js";

const notificationRedisDB = getRedisClient("main");

export const emailQueue = new Queue("email-Queue", {
  connection: notificationRedisDB,
});

export const processEmailEvent = async (data) => {
  try {
    await emailQueue.add("sendEmail", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  } catch (error) {
    logger.error({ error, data }, "_F failed to push email data in queue");
  }
};

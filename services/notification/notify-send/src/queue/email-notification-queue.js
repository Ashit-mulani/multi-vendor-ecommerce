import { Queue } from "bullmq";
import { getRedisClient } from "../config/redis-config.js";

const redis = getRedisClient("main");

export const emailQueue = new Queue("email-Queue", {
  connection: redis,
});

export const deadEmailQueue = new Queue("dead-email-Queue", {
  connection: redis,
});

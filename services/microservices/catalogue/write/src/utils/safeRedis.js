import { getRedisClient } from "../config/redis-config.js";
import logger from "./logger.js";

const redis = getRedisClient("main");

export const redisGet = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.warn(
      {
        error,
        action: "redis-get",
        key,
      },
      "Redis GET failed"
    );
    return null;
  }
};

export const redisSet = async (key, value, ttlSeconds) => {
  try {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, payload, "EX", ttlSeconds);
    } else {
      await redis.set(key, payload);
    }
    return true;
  } catch (error) {
    logger.warn(
      {
        error,
        topic: "vendor-store",
        type: "c",
        action: "redis-set",
        key,
      },
      "_F Redis SET failed"
    );
    return false;
  }
};

export const redisDel = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    logger.warn(
      {
        error,
        action: "redis-del",
        key,
      },
      "_F Redis DEL failed"
    );
    return false;
  }
};

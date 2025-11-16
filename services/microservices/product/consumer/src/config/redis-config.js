import Redis from "ioredis";
import logger from "../utils/logger.js";

const redisClients = {};

function createRedisClient({ name, host, port }) {
  if (!name) {
    throw new Error("Redis client instance must have a unique name.");
  }
  if (!redisClients[name]) {
    const client = new Redis({
      host: host,
      port: port,
      lazyConnect: true,
      connectTimeout: 5000,
      maxRetriesPerRequest: null,
      retryStrategy: () => null,
      commandTimeout: 5000,
    });

    client.on("connect", () => {});

    client.on("error", (error) => {
      logger.error({ error }, "_F redis connect failed");
    });

    const commands = ["get", "set", "del", "expire", "exists"];
    commands.forEach((cmd) => {
      const original = client[cmd].bind(client);
      client[cmd] = async (...args) => {
        if (client.status !== "ready") {
          try {
            await client.connect(); // reconnect on demand
          } catch (error) {
            logger.error({ client: name, error }, "_F Redis reconnect failed");
          }
        }
        return original(...args);
      };
    });

    redisClients[name] = client;
  }
  return redisClients[name];
}

function getRedisClient(name) {
  return redisClients[name] || {};
}

createRedisClient({
  name: "main",
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

export { createRedisClient, getRedisClient };

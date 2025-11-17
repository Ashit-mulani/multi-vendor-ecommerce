import Consul from "consul";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import os from "os";

dotenv.config();

const consul = new Consul({
  host: process.env.CONSUL_HOST || "consul",
  port: process.env.CONSUL_PORT || 8500,
});

const registerWithConsul = async (PORT) => {
  try {
    await consul.agent.service.register({
      name: "catalogue-write-service",
      id: os.hostname() + "write",
      address: "host.docker.internal",
      port: PORT,
      tags: ["write"],
      check: {
        http: `http://host.docker.internal:${PORT}/health`,
        interval: "10s",
      },
    });
  } catch (error) {
    logger.warn({ error }, "Failed to register with Consul");
  }
};

export default registerWithConsul;

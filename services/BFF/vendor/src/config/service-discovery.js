import Consul from "consul";
import dotenv from "dotenv";

dotenv.config();

const consul = new Consul({
  host: process.env.CONSUL_HOST || "localhost",
  port: process.env.CONSUL_PORT || 8500,
});

export const resolveService = async (serviceName) => {
  const services = await consul.health.service({
    service: serviceName,
    passing: true,
  });

  if (!services || services.length === 0) {
    throw new Error(`No healthy instance found for ${serviceName}`);
  }

  const instances = services.map((item) => item.Service);

  const instance = instances[Math.floor(Math.random() * instances.length)];
  let address = instance.Address;

  // ⭐ IMPORTANT FIX:
  // If the service is registered as host.docker.internal (Consul inside Docker),
  // but BFF runs on the host, convert it to localhost.
  if (address === "host.docker.internal") {
    address = "localhost";
  }

  return `http://${address}:${instance.Port}`;
};

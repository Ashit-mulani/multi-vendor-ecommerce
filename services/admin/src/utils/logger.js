import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "admin-service",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

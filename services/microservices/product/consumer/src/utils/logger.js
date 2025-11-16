import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "product-event-consumer",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "vendor-event-consumer",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

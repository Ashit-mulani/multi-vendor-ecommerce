import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "catalogue-event-consumer",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

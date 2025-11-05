import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "catalogue-write",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

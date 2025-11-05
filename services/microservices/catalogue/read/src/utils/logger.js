import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "catalogue-read",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

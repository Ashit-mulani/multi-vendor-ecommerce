import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "notify-consummer",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

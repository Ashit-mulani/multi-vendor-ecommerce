import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "notify-send",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

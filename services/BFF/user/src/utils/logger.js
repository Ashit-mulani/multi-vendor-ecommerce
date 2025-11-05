import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "vendor-BFF",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

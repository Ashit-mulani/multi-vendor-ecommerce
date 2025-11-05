import pino from "pino";

const logger = pino({
  level: "trace",
  base: {
    service: "vendor-backup-DB-worker",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

import { Worker } from "bullmq";
import {
  emailQueue,
  deadEmailQueue,
} from "../queue/email-notification-queue.js";
import { sendEmail } from "../service/send-email.js";
import logger from "../utils/logger.js";

export default async function startEmailWorker() {
  new Worker(
    "email-Queue",
    async (job) => {
      try {
        const { to, subject, body } = job.data;
        await sendEmail(to, subject, body);
      } catch (error) {
        await deadEmailQueue.add("failedEmail", job.data, {
          removeOnComplete: true,
        });
      }
    },
    {
      connection: emailQueue.opts.connection,
      limiter: {
        max: 20,
        duration: 1000,
      },
    }
  );
}

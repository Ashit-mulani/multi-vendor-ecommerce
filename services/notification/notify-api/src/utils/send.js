import { kafka } from "../service/kafka.js";

export const sendEmailEvent = async (data) => {
  await kafka.produceMessage("email-notification", [
    { value: JSON.stringify(data) },
  ]);
};

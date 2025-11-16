import { kafka } from "../service/kafka.js";

export const sendStoreEvent = async (data) => {
  await kafka.produceMessage("vendor-product", [
    { value: JSON.stringify(data) },
  ]);
};

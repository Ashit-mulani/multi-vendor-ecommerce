import { kafka } from "../service/kafka.js";

export const sendStoreEvent = async (data) => {
  await kafka.produceMessage("vendor-store", [{ value: JSON.stringify(data) }]);
};

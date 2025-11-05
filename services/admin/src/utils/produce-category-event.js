import { kafka } from "../service/kafka.js";

export const sendCategoryEvent = async (data) => {
  await kafka.produceMessage("admin-category", [
    { value: JSON.stringify(data) },
  ]);
};

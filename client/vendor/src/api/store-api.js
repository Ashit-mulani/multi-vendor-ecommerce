import api from "@/lib/api-lib";

export const createStore = async (data) => {
  try {
    const res = await api.post("/store/create", data);
    return res?.data;
  } catch (error) {
    const message = err.response?.data?.message || "Failed to create store";
    throw new Error(message);
  }
};

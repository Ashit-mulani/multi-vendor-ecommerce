import axios from "axios";

const adminBackednUrl = import.meta.env.VITE_BACKEND_VENDOR_URL;

const authBackendUrl = import.meta.env.VITE_BACKEND_AUTH_URL;

const api = axios.create({
  baseURL: adminBackednUrl,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get(`${authBackendUrl}/vapnatoken`, {
          withCredentials: true,
        });
        return api(originalRequest);
      } catch (refreshErr) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const authBackendUrl = process.env.NEXT_PUBLIC_BACKEND_AUTH_URL;

const authApi = axios.create({
  baseURL: authBackendUrl,
  withCredentials: true,
});

export default authApi;

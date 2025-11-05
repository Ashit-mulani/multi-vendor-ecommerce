import {
  setAppLoading,
  setUser,
  setUserError,
  setUserLoading,
} from "@/app/slice/user-slice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getDeviceInfo } from "@/hooks/utils-hook/getDeviceInfo";

const backendUrl = import.meta.env.VITE_BACKEND_AUTH_URL;

export default function useUserApi() {
  const dispatch = useDispatch();

  async function getMe() {
    dispatch(setAppLoading(true));
    try {
      const res = await axios.get(`${backendUrl}/me`, {
        withCredentials: true,
      });
      const userData = res?.data?.data;
      if (userData) {
        dispatch(setUser(userData));
      }
      return true;
    } catch (error) {
    } finally {
      dispatch(setAppLoading(false));
    }
  }

  const singup = async () => {
    dispatch(setAppLoading(true));
    try {
      const device = await getDeviceInfo();
      const res = await axios.post(
        `${backendUrl}/singup`,
        {
          device,
        },
        {
          withCredentials: true,
        }
      );
      const userData = res?.data?.data;
      if (userData) {
        dispatch(setUser(userData));
      }
      return true;
    } catch (error) {
      const redirectUrl = error.response?.data?.data?.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        dispatch(
          setUserError(
            error.response?.data?.message || "singup failed, please try later."
          )
        );
      }
    } finally {
      dispatch(setAppLoading(false));
    }
  };

  async function logout() {
    dispatch(setUser(null));
    try {
      const res = await axios.put(
        `${backendUrl}/logout`,
        {},
        { withCredentials: true }
      );
      if (res.data) {
        return true;
      }
    } catch (error) {
      dispatch(
        setUserError(error.response?.data?.message || "Failed to logout user.")
      );
    }
  }

  return {
    getMe,
    singup,
    logout,
  };
}

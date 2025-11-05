import {
  getMe,
  login,
  logout,
  resetPass,
  resetPassOtp,
  singUp,
  singUpWithGoogle,
  verifyOtp,
} from "@/action/user-action";
import { setUser } from "@/store/slice/user-slice";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  getRedirectUrl,
  clearRedirectUrl,
} from "../utils-hooks/getRedirectUrl";

export function useGetMe() {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMe();
      dispatch(setUser(res?.data));
      return res;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });
}

export function useSingUpWithGoogle() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (code) => {
      const res = await singUpWithGoogle(code);
      dispatch(setUser(res?.data));
      return res;
    },
    onSuccess: () => {
      const redirectUrl = getRedirectUrl();
      clearRedirectUrl();
      if (redirectUrl?.startsWith("http")) {
        window.location.href = `${redirectUrl}?ref=${process.env.NEXT_PUBLIC_CLIENT_URL}`;
      }
    },
  });
}

export function useSingUp() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (data) => {
      const res = await singUp(data);
      dispatch(setUser(res?.data));
      return res;
    },
  });
}

export function useVerifyOtp() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (data) => {
      const res = await verifyOtp(data);
      dispatch(setUser(res?.data));
      return res;
    },
    onSuccess: () => {
      const redirectUrl = getRedirectUrl();
      clearRedirectUrl();
      if (redirectUrl?.startsWith("http")) {
        window.location.href = `${redirectUrl}?ref=${process.env.NEXT_PUBLIC_CLIENT_URL}`;
      }
    },
  });
}

export function useLogin() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (data) => {
      const res = await login(data);
      dispatch(setUser(res?.data));
      return res;
    },
    onSuccess: (res) => {
      if (res?.data?.isVerified) {
        const redirectUrl = getRedirectUrl();
        clearRedirectUrl();
        if (redirectUrl?.startsWith("http")) {
          window.location.href = `${redirectUrl}?ref=${process.env.NEXT_PUBLIC_CLIENT_URL}`;
        }
      }
    },
  });
}

export function useLogout() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async () => {
      await logout();
      return true;
    },
    onMutate: () => {
      dispatch(setUser(null));
    },
  });
}

export function useResetPassOtp() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (data) => {
      const res = await resetPassOtp(data);
      dispatch(setUser(res?.data));
      return true;
    },
    onSuccess: () => {
      getRedirectUrl();
    },
  });
}

export function useSetNewPasssword() {
  return useMutation({
    mutationFn: async (data) => {
      const res = await resetPass(data);
      return res;
    },
  });
}

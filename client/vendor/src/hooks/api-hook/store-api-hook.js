import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createStore } from "@/api/store-api";
import { setStore } from "@/app/slice/store-slice";

export function useCraeteStore() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (data) => {
      const res = await createStore(data);
      dispatch(setStore(res));
      return true;
    },
  });
}

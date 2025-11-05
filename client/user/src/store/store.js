// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user-slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export default store;

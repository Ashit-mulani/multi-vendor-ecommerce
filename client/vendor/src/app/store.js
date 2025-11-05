import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user-slice.js";
import storeSlice from "./slice/store-slice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    store: storeSlice,
  },
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  store: null,
  storeLoading: null,
  storeError: null,
};

const storeSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setStore: (state, action) => {
      state.store = action.payload;
    },
    setStoreLoading: (state, action) => {
      state.storeLoading = action.payload;
    },
    setStoreError: (state, action) => {
      state.storeError = action.payload;
    },
  },
});

export const { setStore, setStoreError, setStoreLoading } = storeSlice.actions;

export default storeSlice.reducer;

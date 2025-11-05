import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  appLoading: null,
  userLoading: null,
  userError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setUserError: (state, action) => {
      state.userError = action.payload;
    },
    setAppLoading: (state, action) => {
      state.appLoading = action.payload;
    },
  },
});

export const { setUser, setUserError, setUserLoading, setAppLoading } =
  userSlice.actions;

export default userSlice.reducer;

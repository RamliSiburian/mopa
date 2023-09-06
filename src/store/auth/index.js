import { createSlice } from "@reduxjs/toolkit";

export const authState = createSlice({
  name: "auth",
  initialState: {
    isLogin: true,
  },
  reducers: {
    changeIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { changeIsLogin } = authState.actions;

export const getIsLogin = (state) => state.auth.isLogin;

export default authState.reducer;

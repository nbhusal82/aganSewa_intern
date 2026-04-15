import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: null,
  isAuth: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload || {};

      state.user = payload.user || payload;
      state.token = payload.token || null;
      state.isAuth = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
    },
  },
});
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;

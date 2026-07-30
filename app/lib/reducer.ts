import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Admin, AuthState, User } from "../../global";


const initialState: AuthState = {
  user: null,
  admin: null,
  token: '',
  userLoggedIn: false,
  adminLoggedIn: false,
};

const authSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    dispatchUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.userLoggedIn = true;
    },
    dispatchAdmin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.adminLoggedIn = true;
    },
    dispatchLoginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.userLoggedIn = true;
    },

    dispatchLoginAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
      state.adminLoggedIn = true;
    },
    dispatchToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

  },
});

export const { dispatchAdmin, dispatchLoginAdmin, dispatchUser, dispatchLoginUser, dispatchToken} = authSlice.actions;

export default authSlice.reducer;
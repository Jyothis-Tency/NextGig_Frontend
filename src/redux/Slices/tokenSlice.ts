import { createSlice } from "@reduxjs/toolkit";
import { loginUserAct } from "../Actions/userActions";

interface Token {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
}

const initialState: Token = {
  accessToken: null,
  refreshToken: null,
  role: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
    addTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAct.fulfilled, (state, action) => {
      if (action.payload) {
        console.log("action.payload.................", action.payload);

        state.accessToken = action.payload.userData.accessToken;
        state.refreshToken = action.payload.userData.refreshToken;
        state.role = action.payload.userData.role;
      }
    });
  },
});

export const { clearTokens, addTokens } = tokenSlice.actions;
export default tokenSlice.reducer;

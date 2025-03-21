import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  username: string | null; // ✅ Add username field
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  username: null, // ✅ Initialize username
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: any;
        username: string; // ✅ Explicitly include username
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.username = action.payload.username; // ✅ Save username in Redux

      // ✅ Persist in AsyncStorage
      AsyncStorage.setItem("accessToken", action.payload.accessToken);
      AsyncStorage.setItem("refreshToken", action.payload.refreshToken);
      AsyncStorage.setItem("user", JSON.stringify(action.payload.user));
      AsyncStorage.setItem("username", action.payload.username);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.username = null; // ✅ Clear username

      // ✅ Remove from AsyncStorage
      AsyncStorage.removeItem("accessToken");
      AsyncStorage.removeItem("refreshToken");
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("username");
    },
    restoreSession: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        refreshToken: string | null;
        user: any | null;
        username: string | null;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.username = action.payload.username;
    },
  },
});

export const { setCredentials, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;

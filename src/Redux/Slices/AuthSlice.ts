import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthAPI } from "../../API/Index";
import type { LoginCredentials } from "../../Interface/LoginCredentials";
import type { RootState } from "../Store";

interface AuthState {
  user: LoginCredentials | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

let parsedUser: LoginCredentials | null = null;
try {
  const storedUser = localStorage.getItem("adminUser");
  if (storedUser && storedUser !== "undefined") {
    parsedUser = JSON.parse(storedUser);
  }
} catch {
  parsedUser = null;
}

const initialState: AuthState = {
  user: parsedUser,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "admin/login",
  async (
    {
      email,
      password,
      deviceId,
    }: { email: string; password: string; deviceId: string },
    thunkAPI
  ) => {
    try {
      const res = await AuthAPI.login({ email, password, deviceId });
      const { accessToken, refreshToken } = res.data.tokens;
      const { user } = res.data.admin;
      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("admin/logout", async () => {
  localStorage.removeItem("adminUser");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
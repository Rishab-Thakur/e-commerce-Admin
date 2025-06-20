import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthAPI } from "../../API/AuthAPI";
import type {
  LoginRequest,
  // LogoutRequest,
} from "../../Interface/AuthServiceInterfaces";
import type { RootState } from "../Store";

interface AuthState {
  user: {
    email: string;
    role: string;
    deviceId?: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

let parsedUser: AuthState["user"] | null = null;
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


export const loginUser = createAsyncThunk<
  { user: AuthState["user"]; accessToken: string; refreshToken: string },
  LoginRequest,
  { rejectValue: string }
>("admin/login", async ({ email, password, deviceId }, thunkAPI) => {
  try {
    const res = await AuthAPI.login({ email, password, deviceId });
    const { tokens, admin } = res.data;

    const user = {
      email: admin.email,
      role: admin.role,
      deviceId: admin.deviceId,
    };

    localStorage.setItem("adminUser", JSON.stringify(user));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Login failed"
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { state: RootState }>(
  "admin/logout",
  async (_, thunkAPI) => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    try {
      const token = thunkAPI.getState().auth.accessToken;
      if (token) {
        await AuthAPI.logout({ accessToken: token });
      }
    } catch {
    } finally {
      // localStorage.removeItem("adminUser");
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
    }
  }
);

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
        state.error = action.payload ?? "Login failed";
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



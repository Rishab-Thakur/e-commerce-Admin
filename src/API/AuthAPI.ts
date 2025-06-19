import { api, loginApi } from "./Index";
import type {
  LoginRequest,
  LoginResponses,
  LogoutRequest,
  LogoutResponse,
  ResetPasswordRequest,
} from "../Interface/AuthServiceInterfaces";

export const AuthAPI = {
  login: (credentials: LoginRequest) =>
    loginApi.post<LoginResponses>("/login", credentials),

  forgetPassword: (email: string) =>
    api.post("/forget-password", { email }),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post("/verify-otp", data),

  // resetPassword: (data: { email: string; password: string }) =>
  //   api.post("/reset-password", data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post("/change-password", data),

  logout: (data: LogoutRequest) =>
    api.post<LogoutResponse>("/logout", data),

  sendOtp: (payload: { email: string }) =>
    api.post("/forgot-password", payload),

  resetPassword: (payload: ResetPasswordRequest) => 
    api.post("/reset-password", payload),
};

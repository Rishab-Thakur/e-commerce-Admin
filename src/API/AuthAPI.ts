import { api } from "./Index"; 
import type  {
  LoginRequest,
  LoginResponses,
  LogoutRequest,
  LogoutResponse,
} from "../Interface/AuthServiceInterfaces";

export const AuthAPI = {
  login: (credentials: LoginRequest) =>
    api.post<LoginResponses>("/login", credentials),

  forgetPassword: (email: string) =>
    api.post("/forget-password", { email }),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post("/verify-otp", data),

  resetPassword: (data: { email: string; password: string }) =>
    api.post("/reset-password", data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post("/change-password", data),

  logout: (data: LogoutRequest) =>
    api.post<LogoutResponse>("/logout", data),
};

export interface LogoutRequest {
  accessToken: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
}

export interface LoginResponses {
  admin: {
    email: string;
    deviceId?: string;
    role: string;
    entityId: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ResetPasswordRequest{
  otp: string;
  newPassword: string;
  token: string;
};

export interface ChangePasswordRequest{
  oldPassword: string;
  newPassword: string;
}

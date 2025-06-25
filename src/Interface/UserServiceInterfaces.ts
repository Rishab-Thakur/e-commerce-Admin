export interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string;
  status: string;
  role: string;
}

export interface GetAllUsersRequest {
  page?: number;
  limit?: number;
}

export interface GetAllUsersResponse {
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  success: boolean;
  message: string;
}

export interface SearchUsersRequest {
  query: string;
  limit: number;
}

export interface SearchUsersResponse {
  users: UserData[];
  total: number;
  success: boolean;
}

export interface UnblockUserResponse {
  user?: UserData;
  success: boolean;
  message: string;
}

export interface BlockUserResponse {
  success: boolean;
  message: string;
  user?: UserData;
}

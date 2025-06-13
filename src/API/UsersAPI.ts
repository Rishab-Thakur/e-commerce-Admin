import { api } from "./Index";
import type {
  GetAllUsersRequest,
  GetAllUsersResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UnblockUserResponse,
  BlockUserResponse,
} from "../Interface/UserServiceInterfaces";


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const UsersAPI = {
  getAll: (params?: GetAllUsersRequest) =>
    api.get<GetAllUsersResponse>("/users", { params }),

  search: (params: SearchUsersRequest) =>
    api.get<SearchUsersResponse>("/users/search", { params }),

  block: (id: string) =>
    api.put<BlockUserResponse>(`/users/block/${id}`),

  unblock: (id: string) =>
    api.put<UnblockUserResponse>(`/users/unblock/${id}`),
};

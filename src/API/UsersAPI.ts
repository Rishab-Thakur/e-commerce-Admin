import { api } from "./Index";
import type {
  GetAllUsersRequest,
  GetAllUsersResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UnblockUserResponse,
  BlockUserResponse,
} from "../Interface/UserServiceInterfaces";

export const UsersAPI = {
  getAll: (params?: GetAllUsersRequest) =>
    api.get<GetAllUsersResponse>("/users", { params }),

  search: (params: SearchUsersRequest) =>
    api.get<SearchUsersResponse>("/users/search", { params }),

  block: (id: string) => api.put<BlockUserResponse>(`/users/block/${id}`),

  unblock: (id: string) => api.put<UnblockUserResponse>(`/users/unblock/${id}`),

  download: () => api.get("/users/all"),
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersAPI } from "../../API/UsersAPI";
import type {
  GetAllUsersRequest,
  GetAllUsersResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UserData,
} from "../../Interface/UserServiceInterfaces";

interface UserState {
  users: UserData[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  total: 0,
  totalPages: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<
  GetAllUsersResponse,
  GetAllUsersRequest | undefined
>("admin/users", async (params = {}, thunkAPI) => {
  try {
    const res = await UsersAPI.getAll(params);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Failed to fetch users.");
  }
});

export const blockUser = createAsyncThunk<UserData, string>(
  "users/block",
  async (id, thunkAPI) => {
    try {
      const res = await UsersAPI.block(id);
      if (!res.data || !res.data.user) throw new Error("No user returned");
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to block user.");
    }
  }
);

export const unblockUser = createAsyncThunk<UserData, string>(
  "users/unblock",
  async (id, thunkAPI) => {
    try {
      const res = await UsersAPI.unblock(id);
      if (!res.data || !res.data.user) throw new Error("No user returned");
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to unblock user.");
    }
  }
);

export const searchUsers = createAsyncThunk<
  SearchUsersResponse,
  SearchUsersRequest
>("users/search", async (params, thunkAPI) => {
  try {
    const res = await UsersAPI.search(params);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to search users.");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.total = action.payload.total;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;

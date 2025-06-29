import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardAPI } from "../../API/DashboardAPI";
import type { DashboardData } from "../../Interface/Dashboard";
import type { RootState } from "../Store";

const initialState: DashboardData = {
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const token = state.auth.accessToken;
    if (!token) {
      return thunkAPI.rejectWithValue("Not authenticated");
    }

    try {
      const stats = await DashboardAPI.getStats();

      return {
        totalProducts: stats.data.totalProducts || 0,
        totalOrders: stats.data.totalOrders || 0,
        totalUsers: stats.data.totalUsers || 0,
        totalRevenue: stats.data.totalRevenue || 0,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalProducts = action.payload.totalProducts;
        state.totalOrders = action.payload.totalOrders;
        state.totalUsers = action.payload.totalUsers;
        state.totalRevenue = action.payload.totalRevenue;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardAPI } from "../../API/Index";
import type {DashboardData} from "../../Interface/Dashboard"


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
    try {
      const [products, orders, users, revenue] = await Promise.all([
        DashboardAPI.getTotalProducts(),
        DashboardAPI.getTotalOrders(),
        DashboardAPI.getTotalUsers(),
        DashboardAPI.getTotalRevenue(),
      ]);

      return {
        totalProducts: products.data.total || 0,
        totalOrders: orders.data.total || 0,
        totalUsers: users.data.total || 0,
        totalRevenue: revenue.data.total || 0,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load dashboard data");
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

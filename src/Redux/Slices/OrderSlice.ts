import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../Store";
import type { Order } from "../../Interface/Order";
import { OrdersAPI } from "../../API/Index";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk("admin/order", async (_, thunkAPI) => {
  try {
    const res = await OrdersAPI.getAll();
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load orders");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectOrders = (state: RootState) => state.orders;
export default orderSlice.reducer;

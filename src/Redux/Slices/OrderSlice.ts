import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderAPI } from "../../API/OrderAPI";
import type {
  OrderResponse,
  GetAllOrdersRequest,
  GetAllOrdersResponse,
  UpdateOrderStatusRequest,
} from "../../Interface/OrderServiceInterface";

interface OrderState {
  orders: OrderResponse[];
  selectedOrder: OrderResponse | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

// Fetch all paginated orders
export const fetchOrders = createAsyncThunk<
  GetAllOrdersResponse,
  GetAllOrdersRequest,
  { rejectValue: string }
>("orders/fetchAll", async (params, thunkAPI) => {
  try {
    const res = await OrderAPI.getAllOrders(params);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to fetch orders"
    );
  }
});

// Fetch single order details
export const fetchOrderById = createAsyncThunk<
  OrderResponse,
  { userId: string; orderId: string },
  { rejectValue: string }
>("orders/fetchById", async ({ userId, orderId }, thunkAPI) => {
  try {
    const res = await OrderAPI.getOrderById(userId, orderId);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to fetch order"
    );
  }
});

// Update order status
export const updateOrderStatus = createAsyncThunk<
  void,
  UpdateOrderStatusRequest,
  { rejectValue: string }
>("orders/updateStatus", async (data, thunkAPI) => {
  try {
    await OrderAPI.updateOrderStatus(data);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message || "Failed to update order status"
    );
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching orders";
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching order details";
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating order status";
      });
  },
});

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;

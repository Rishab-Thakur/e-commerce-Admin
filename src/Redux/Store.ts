import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice"
import productReducer from "./Slices/ProductSlice";
import userReducer from "./Slices/UserSlice";
import orderReducer from "./Slices/OrderSlice";
import dashboardReducer from "./Slices/DashboardSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    auth: authReducer,
    products: productReducer,
    users: userReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

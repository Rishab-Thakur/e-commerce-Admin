import axios from "axios";

const BASE_URL = "http://localhost:4000/admin";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthAPI = {
  login: (credentials: { email: string; password: string; deviceId: string }) =>
    api.post("/login", credentials),

  forgetPassword: (email: string) =>
    api.post("/forget-password", { email }),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post("/verify-otp", data),

  resetPassword: (data: { email: string; password: string }) =>
    api.post("/reset-password", data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post("/change-password", data),

  logout: () => api.post("/logout"),
};

export const DashboardAPI = {
  getTotalProducts: () => api.get("/dashboard/products"),
  getTotalOrders: () => api.get("/dashboard/orders"),
  getTotalUsers: () => api.get("/dashboard/users"),
  getTotalRevenue: () => api.get("/dashboard/revenue"),
};

export const ProductsAPI = {
  getAll: () => api.get("/products"),
  getById: (id: string) => api.get(`/products/${id}`),
  addProduct: (productData: any) => api.post("/products", productData),
  updateProduct: (id: string, updatedData: any) => api.put(`/products/${id}`, updatedData),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

export const OrdersAPI = {
  getAll: () => api.get("/order"),
  getById: (id: string) => api.get(`/order/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/order/${id}`, { status }),
  returnOrder: (orderId: string) => api.post("/order/return", { orderId }),
  cancelOrder: (orderId: string) => api.post("/order/cancel", { orderId }),
};



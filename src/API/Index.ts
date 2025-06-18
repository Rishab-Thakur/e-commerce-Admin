import axios from "axios";

// const BASE_URL = "http://localhost:3002/admin";
const BASE_URL = "http://172.50.1.26:3007/admin";
// const BASE_URL = "http://172.50.3.140:3009/admin";

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



// export const DashboardAPI = {
//   getStats: () => api.get("/dashboard"),
// };



export const OrdersAPI = {
  getAll: () => api.get("/order"),
  getById: (id: string) => api.get(`/order/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/order/${id}`, { status }),
  returnOrder: (orderId: string) => api.post("/order/return", { orderId }),
  cancelOrder: (orderId: string) => api.post("/order/cancel", { orderId }),
};




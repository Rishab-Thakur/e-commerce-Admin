import { api } from "./Index";
import type {
  GetAllOrdersRequest,
  GetAllOrdersResponse,
  OrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "../Interface/OrderServiceInterface";

export const OrderAPI = {
  getAllOrders: (params: GetAllOrdersRequest) =>
    api.get<GetAllOrdersResponse>("/orders", { params }),

  getOrderById: (userId: string, orderId: string) =>
    api.get<OrderResponse>(`/orders/${userId}/${orderId}`),

  updateOrderStatus: (data: UpdateOrderStatusRequest) =>
    api.post<UpdateOrderStatusResponse>("/orders/status", data),
};

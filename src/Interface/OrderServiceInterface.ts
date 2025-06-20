export interface GetOrderRequest {
  orderId: string;
  userId: string;
}

export interface ProductItem {
  productId: string;
  description: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  products: ProductItem[];
  address: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  sessionId: string;
  paymentUrl: string;
  refundId: string;
  createdAt: string;
}

export interface GetAllOrdersRequest {
  page: number;
  limit: number;
}

export interface GetAllOrdersResponse {
  orders: OrderResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
}

import {api} from "./Index"; 
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilter,
  UpdateInventoryRequest,
} from "../Interface/ProductServiceInterfaces";

export const ProductAPI = {
  createProduct: (data: CreateProductRequest) =>
    api.post("/products/create", data),

  updateProduct: (data: UpdateProductRequest) =>
    api.patch(`/products/${data.id}`, data),

  getProduct: (id: string) =>
    api.get(`/products/${id}`),

  listProducts: (filters: ProductFilter) =>
    api.get("/products", { params: filters }),

  deleteProduct: (id: string) =>
    api.delete(`/products/${id}`),

  updateInventory: (data: UpdateInventoryRequest) =>
    api.put(`/products/${data.productId}/inventory`, data),
};

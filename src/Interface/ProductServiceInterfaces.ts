export interface Variant {
  _id?: string;
  size: string;
  color: string;
  stock: number;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  subCategory?: string;
  gender: string;
  brand: string;
  images: ProductImage[];
  description: string;
  price: number;
  totalStock: number;
  variants: Variant[];
}

export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

export interface UpdateProductRequest {
  _id: string;
  name?: string;
  category?: string;
  subCategory?: string;
  gender?: string;
  brand?: string;
  images?: ProductImage[];
  description?: string;
  price?: number;
  variants?: Variant[];
}

export interface ProductID {
  _id: string;
}

export interface ProductFilter {
  page?: number;
  pageSize?: number;
  category?: string;
  brand?: string;
  subCategory?: string;
  name?: string;
  gender?: string;
}

export interface UpdateInventoryRequest {
  productId: string;
  variants: Variant[];
}

export interface ProductData {
  _id: string;
  name: string;
  brand: string;
  images: ProductImage[];
  description: string;
  price: number;
  totalStock: number;
  variants: Variant[];
  category: string;
  subCategory: string;
  gender: string;
}

export interface ListProductsResponse {
  products: ProductData[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Response {
  code: number;
  status: string;
  timestamp: string;
  data: {
    data: ListProductsResponse;
  };
  error: string;
}

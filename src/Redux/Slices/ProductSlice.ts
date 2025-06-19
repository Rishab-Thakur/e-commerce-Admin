import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductAPI } from "../../API/ProductsAPI";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilter,
  Variant,
  ProductData,
} from "../../Interface/ProductServiceInterfaces";
import type { RootState } from "../Store";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  gender: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: (Variant & { id: string })[];
}

interface ProductState {
  products: ProductData[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
};


export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (filters: ProductFilter = {}, thunkAPI) => {
    try {
      const response = await ProductAPI.listProducts(filters);
      return response.data.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.data?.message || "Failed to fetch products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (product: CreateProductRequest, thunkAPI) => {
    try {
      await ProductAPI.createProduct(product);
      thunkAPI.dispatch(fetchProducts({}));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (product: UpdateProductRequest, thunkAPI) => {
    try {
      await ProductAPI.updateProduct(product);
      thunkAPI.dispatch(fetchProducts({}));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, thunkAPI) => {
    try {
      await ProductAPI.deleteProduct(id);
      thunkAPI.dispatch(fetchProducts({}));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);



const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pageSize = action.payload.pageSize || 10;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export const selectProducts = (state: RootState) => state.products;
export default productSlice.reducer;

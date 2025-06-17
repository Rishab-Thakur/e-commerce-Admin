import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductAPI } from "../../API/ProductsAPI";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilter,
  UpdateInventoryRequest,
  Variant,
} from "../../Interface/ProductServiceInterfaces";
import type { RootState } from "../Store";

export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: (Variant & { id: string })[];
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
};


// Thunks


export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (filters: ProductFilter = {}, thunkAPI) => {
    try {
      const response = await ProductAPI.listProducts(filters);
      return response.data.data;
      console.log(response.data.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getOne",
  async (id: string, thunkAPI) => {
    try {
      const res = await ProductAPI.getProduct(id);
      const product = JSON.parse(res.data.data) as Product;
      return product;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch product");
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

export const updateInventory = createAsyncThunk(
  "products/updateInventory",
  async (data: UpdateInventoryRequest, thunkAPI) => {
    try {
      await ProductAPI.updateInventory(data);
      thunkAPI.dispatch(fetchProducts({}));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update inventory");
    }
  }
);

// Slice

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.selectedProduct = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProduct, setPage } = productSlice.actions;
export const selectProducts = (state: RootState) => state.products;
export default productSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductsAPI } from "../../API/Index";
import type { Product } from "../../Interface/Product";
import type { RootState } from "../Store";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk("products/fetch", async (_, thunkAPI) => {
  try {
    const response = await ProductsAPI.getAll();
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch products");
  }
});

// Add product
export const addProduct = createAsyncThunk<Product, Omit<Product, "id">>(
  "products/add",
  async (newProduct, thunkAPI) => {
    try {
      const response = await ProductsAPI.addProduct(newProduct);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add product"
      );
    }
  }
);


// Update product
export const updateProduct = createAsyncThunk(
  "products/update",
  async (updatedProduct: Product, thunkAPI) => {
    try {
      const response = await ProductsAPI.updateProduct(updatedProduct.id, updatedProduct);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id: string, thunkAPI) => {
  try {
    await ProductsAPI.deleteProduct(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete product");
  }
});

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
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      });
  },
});

export const selectProducts = (state: RootState) => state.products;
export default productSlice.reducer;

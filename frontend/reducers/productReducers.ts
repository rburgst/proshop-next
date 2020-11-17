import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../pages/api/data/products";
import fetch from "isomorphic-unfetch";
import { AppDispatch } from "../store";

export type ProductListState = {
  loading: boolean;
  products: IProduct[];
  error?: any;
};

const initialState: ProductListState = {
  loading: false,
  products: [],
};

// thunks

export const fetchProducts = createAsyncThunk<IProduct[]>(
  "productList/fetch",
  async (thunkAPI) => {
    const response = await fetch("/api/products");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    return data as IProduct[];
  }
);

// slice

export const productListSlice = createSlice({
  name: "productList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.products = [];
    });
    builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

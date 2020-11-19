import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../pages/api/data/products";
import fetch from "isomorphic-unfetch";
import { AppDispatch } from "../store";

export type ProductListState = {
  loading: boolean;
  products: IProduct[];
  error?: any;
};

const initialProductListState: ProductListState = {
  loading: false,
  products: [],
};

// thunks

export const fetchProducts = createAsyncThunk<IProduct[]>(
  "PRODUCT_LIST",
  async (thunkAPI) => {
    const response = await fetch("/api/products");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    return data as IProduct[];
  }
);

export const fetchProduct = createAsyncThunk<IProduct, string>(
  "PRODUCT_DETAILS",
  async (productId, thunkAPI) => {
    const response = await fetch(`/api/products/${productId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    return data as IProduct;
  }
);

// slice

export const productListSlice = createSlice({
  name: "productList",
  initialState: initialProductListState,
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

export type ProductDetailsState = {
  loading: boolean;
  product: IProduct;
  error?: any;
};

const initialProductDetailsState: ProductDetailsState = {
  loading: false,
  product: { reviews: [] } as IProduct,
};

export const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState: initialProductDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.product = payload;
    });
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

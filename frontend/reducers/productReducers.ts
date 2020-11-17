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

// slice

const productListSlice = createSlice({
  name: "productList",
  initialState: initialState,
  reducers: {
    productListRequest(state, action: PayloadAction<undefined>) {
      state.loading = true;
      state.products = [];
    },
    productListSuccess(state, action: PayloadAction<IProduct[]>) {
      state.loading = false;
      state.products = action.payload;
    },
    productListFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// actions
export const listProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(productListSlice.actions.productListRequest());
    const response = await fetch("/api/products");
    const data: IProduct[] = await response.json();

    dispatch(productListSlice.actions.productListSuccess(data));
  } catch (error) {
    const errorMsg = error.response?.data?.message ?? error.message;
    dispatch(productListSlice.actions.productListFail(errorMsg));
  }
};
export default productListSlice;

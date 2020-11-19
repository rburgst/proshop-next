import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {
  productListSlice,
  productDetailsSlice,
} from "./reducers/productReducers";

const store = configureStore({
  reducer: {
    productList: productListSlice.reducer,
    productDetails: productDetailsSlice.reducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;

export default store;

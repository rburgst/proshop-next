import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import productListSlice from "./reducers/productReducers";

const store = configureStore({
  reducer: {
    productList: productListSlice.reducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, IProductDoc } from "../../server/models/productModel";
import { RootState } from "../store";

export interface CartItem {
  /** the product id. */
  product: string;
  name: string;
  image: string;
  countInStock: number;
  price: number;
  qty: number;
}
export interface CartState {
  cartItems: CartItem[];
}

const initialCartState: CartState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState: initialCartState,
  reducers: {
    addItem: (state: CartState, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (it) => it.product === item.product
      );
      if (existingItem) {
        // replace the previous cart item with new one
        state.cartItems = state.cartItems.map((x) =>
          x.product === item.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
    },
  },
});

// action thunks

export const addToCart = createAsyncThunk(
  "ADD_TO_CART",
  async (payload: { productId: string; qty: number }, thunkAPI) => {
    const { productId, qty } = payload;
    const response = await fetch(`/api/products/${productId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    const product = data as IProductDoc;

    const { dispatch, getState } = thunkAPI;
    dispatch(
      cartSlice.actions.addItem({
        product: product._id,
        name: product.name,
        countInStock: product.countInStock,
        image: product.image,
        price: product.price,
        qty,
      })
    );

    // also save the store state to local storage
    const storeState = getState() as RootState;
    const stateToStore = storeState.cart.cartItems;
    localStorage.setItem("cartItems", JSON.stringify(stateToStore));

    return data;
  }
);
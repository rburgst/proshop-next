import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShippingAddress } from "../../server/models/models";
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
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
}

const initialCartState: CartState = {
  cartItems: [],
  paymentMethod: "PayPal",
};

export const cartSlice = createSlice({
  name: "cart",
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
    removeItem: (state: CartState, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
    },
    saveShippingAddress: (
      state: CartState,
      action: PayloadAction<ShippingAddress>
    ) => {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod: (state: CartState, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
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

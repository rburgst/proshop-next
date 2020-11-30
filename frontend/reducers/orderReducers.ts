import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShippingAddress } from "../../server/models/models";
import { IProduct, IProductDoc } from "../../server/models/productModel";
import { RootState } from "../store";
import {
  IOrder,
  IOrderInput,
  OrderItem,
  PaymentResult,
} from "../../server/models/orderModel";
import { UserLoginState } from "./userReducers";

// action thunks

export const createOrder = createAsyncThunk<IOrderWithId, IOrderInput>(
  "ORDER_CREATE",
  async (payload: IOrderInput, thunkAPI) => {
    const state: RootState = thunkAPI.getState();
    const userLogin: UserLoginState = state.userLogin;
    const token = userLogin.userInfo?.token;

    if (!token) {
      throw new Error("no user login token");
    }
    const response = await fetch(`/api/orders`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    const order = data as IOrderWithId;
    return order;
  }
);

export const getOrderDetails = createAsyncThunk<IOrderWithId, string>(
  "ORDER_DETAILS",
  async (orderId: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState();
    const userLogin: UserLoginState = state.userLogin;
    const token = userLogin.userInfo?.token;

    if (!token) {
      throw new Error("no user login token");
    }
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    const order = data as IOrderWithId;
    return order;
  }
);

export interface PayData {
  paymentResult: PaymentResult;
  orderId: string;
}

export const payOrder = createAsyncThunk<IOrderWithId, PayData>(
  "ORDER_PAY",
  async (args: PayData, thunkAPI) => {
    const state: RootState = thunkAPI.getState();
    const userLogin: UserLoginState = state.userLogin;
    const token = userLogin.userInfo?.token;

    if (!token) {
      throw new Error("no user login token");
    }
    const { orderId, paymentResult } = args;
    const response = await fetch(`/api/orders/${orderId}/pay`, {
      method: "PUT",
      body: JSON.stringify(paymentResult),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    const updatedOrder = data as IOrderWithId;
    return updatedOrder;
  }
);

// Slice
export interface IOrderWithId extends IOrder {
  _id: string;
}

export interface OrderCreateState {
  loading: boolean;
  success?: boolean;
  order?: IOrderWithId;
  error?: string;
}

const initialOrderCreateState: OrderCreateState = { loading: false };

export const orderCreateSlice = createSlice({
  name: "orderCreate",
  initialState: initialOrderCreateState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.order = payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export interface OrderDetailsState {
  loading: boolean;
  order?: IOrderWithId;
  error?: string;
}

const initialOrderDetailsState: OrderDetailsState = {
  loading: false,
  order: undefined,
};

export const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState: initialOrderDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.order = payload;
    });
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export interface OrderPayState {
  loading: boolean;
  order?: IOrderWithId;
  error?: string;
  success?: boolean;
}

const initialOrderPayState: OrderPayState = {
  loading: false,
  order: undefined,
};

export const orderPaySlice = createSlice({
  name: "orderPay",
  initialState: initialOrderPayState,
  reducers: {
    reset: (state, action: PayloadAction<void>) => {
      state.error = undefined;
      state.loading = false;
      state.order = undefined;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(payOrder.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(payOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.order = payload;
      state.success = true;
    });
    builder.addCase(payOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

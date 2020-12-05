import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { IOrder, IOrderInput, PaymentResult } from '../../server/models/orderModel'
import { RootState } from '../store'
import { logout, UserLoginState } from './userReducers'

// action thunks

export const createOrder = createAsyncThunk<IOrderWithId, IOrderInput>(
  'ORDER_CREATE',
  async (payload: IOrderInput, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token

    if (!token) {
      throw new Error('no user login token')
    }
    const response = await fetch(`/api/orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const order = data as IOrderWithId
    return order
  }
)

export const getOrderDetails = createAsyncThunk<IOrderWithId, string>(
  'ORDER_DETAILS',
  async (orderId: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token

    if (!token) {
      throw new Error('no user login token')
    }
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const order = data as IOrderWithId
    return order
  }
)

export const listMyOrders = createAsyncThunk<IOrderWithId[]>(
  'ORDER_LIST_MY',
  async (args, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token

    if (!token) {
      throw new Error('no user login token')
    }
    const response = await fetch(`/api/orders/myorders`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const order = data as IOrderWithId[]
    return order
  }
)

export const listAdminOrders = createAsyncThunk<IOrderWithUser[]>(
  'ORDER_LIST_ALL',
  async (args, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token

    if (!token) {
      throw new Error('no user login token')
    }
    const response = await fetch(`/api/orders`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const order = data as IOrderWithUser[]
    return order
  }
)

export interface PayData {
  paymentResult: PaymentResult
  orderId: string
}

export const payOrder = createAsyncThunk<IOrderWithId, PayData>(
  'ORDER_PAY',
  async (args: PayData, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token

    if (!token) {
      throw new Error('no user login token')
    }
    const { orderId, paymentResult } = args
    const response = await fetch(`/api/orders/${orderId}/pay`, {
      method: 'PUT',
      body: JSON.stringify(paymentResult),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const updatedOrder = data as IOrderWithId
    return updatedOrder
  }
)

// Slice
export interface IOrderWithId extends IOrder {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface IOrderWithUser extends IOrderWithId {
  user: {
    name: string
    _id: string
  }
}

export interface OrderCreateState {
  loading: boolean
  success?: boolean
  order?: IOrderWithId
  error?: string
}

const initialOrderCreateState: OrderCreateState = { loading: false }

export const orderCreateSlice = createSlice({
  name: 'orderCreate',
  initialState: initialOrderCreateState,
  reducers: {
    reset: (state) => {
      state.error = undefined
      state.loading = false
      state.order = undefined
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.loading = false
      state.success = true
      state.order = payload
    })
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface OrderDetailsState {
  loading: boolean
  order?: IOrderWithId
  error?: string
}

const initialOrderDetailsState: OrderDetailsState = {
  loading: false,
  order: undefined,
}

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState: initialOrderDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(getOrderDetails.fulfilled, (state, { payload }) => {
      state.loading = false
      state.order = payload
    })
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface OrderPayState {
  loading: boolean
  order?: IOrderWithId
  error?: string
  success?: boolean
}

const initialOrderPayState: OrderPayState = {
  loading: false,
  order: undefined,
}

export const orderPaySlice = createSlice({
  name: 'orderPay',
  initialState: initialOrderPayState,
  reducers: {
    reset: (state) => {
      state.error = undefined
      state.loading = false
      state.order = undefined
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(payOrder.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(payOrder.fulfilled, (state, { payload }) => {
      state.loading = false
      state.order = payload
      state.success = true
    })
    builder.addCase(payOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface OrderListMyState {
  loading: boolean
  orders: IOrderWithId[]
  error?: string
}

const initialOrderListMyState: OrderListMyState = {
  loading: false,
  orders: [],
}

export const orderListMySlice = createSlice({
  name: 'orderListMy',
  initialState: initialOrderListMyState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listMyOrders.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(listMyOrders.fulfilled, (state, { payload }) => {
      state.loading = false
      state.orders = payload
    })
    builder.addCase(listMyOrders.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    builder.addCase(logout, (state) => {
      state.error = undefined
      state.loading = false
      state.orders = []
    })
  },
})

export interface OrderListState {
  loading: boolean
  orders: IOrderWithUser[]
  error?: string
}

const initialOrderListState: OrderListState = {
  loading: false,
  orders: [],
}

export const orderListSlice = createSlice({
  name: 'orderList',
  initialState: initialOrderListState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listAdminOrders.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(listAdminOrders.fulfilled, (state, { payload }) => {
      state.loading = false
      state.orders = payload
    })
    builder.addCase(listAdminOrders.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    builder.addCase(logout, (state) => {
      state.error = undefined
      state.loading = false
      state.orders = []
    })
  },
})

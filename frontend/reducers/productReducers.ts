import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import fetch from 'isomorphic-unfetch'

import { IProductWithId } from '../../server/models/productModel'

export type ProductListState = {
  loading: boolean
  products: IProductWithId[]
  error?: string
}

const initialProductListState: ProductListState = {
  loading: false,
  products: [],
}

// thunks

export const fetchProducts = createAsyncThunk<IProductWithId[]>('PRODUCT_LIST', async () => {
  const response = await fetch('/api/products')
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText)
  }
  return data as IProductWithId[]
})

export const fetchProduct = createAsyncThunk<IProductWithId, string>(
  'PRODUCT_DETAILS',
  async (productId) => {
    const response = await fetch(`/api/products/${productId}`)
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    return data as IProductWithId
  }
)

// slice

export const productListSlice = createSlice({
  name: 'productList',
  initialState: initialProductListState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true
      state.products = []
    })
    builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products = payload
    })
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export type ProductDetailsState = {
  loading: boolean
  product?: IProductWithId
  error?: string
}

const initialProductDetailsState: ProductDetailsState = {
  loading: false,
}

export const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState: initialProductDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchProduct.fulfilled, (state, { payload }) => {
      state.loading = false
      state.product = payload
    })
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

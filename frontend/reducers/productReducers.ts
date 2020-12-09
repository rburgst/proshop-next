import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import fetch from 'isomorphic-unfetch'

import {
  ICreateProductInput,
  ICreateReviewInput,
  IProductPage,
  IProductWithId,
} from '../../server/models/productModel'
import { RootState } from '../store'
import { UserLoginState } from './userReducers'

export type ProductListState = {
  loading: boolean
  products: IProductWithId[]
  error?: string
  page: number
  pages: number
}

const initialProductListState: ProductListState = {
  loading: false,
  products: [],
  page: 1,
  pages: 1,
}

// thunks

export const fetchProducts = createAsyncThunk<
  IProductPage,
  { keyword: string; pageNumber?: number; pageSize?: number }
>('PRODUCT_LIST', async (args) => {
  const { keyword } = args
  const pageSize = args.pageSize ?? 10
  const pageNumber = args.pageNumber ?? 1
  const response = await fetch(
    `/api/products?keyword=${keyword ?? ''}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText)
  }
  return data as IProductPage
})

export const listTopProducts = createAsyncThunk<IProductWithId[], void>('PRODUCT_TOP', async () => {
  const response = await fetch(`/api/products/top`)
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

export const deleteProduct = createAsyncThunk<boolean, string>(
  'PRODUCT_DELETE',
  async (productId, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState
    const token = state.userLogin.userInfo.token

    const response = await fetch(`/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    return true
  }
)

export const createProduct = createAsyncThunk<IProductWithId>(
  'PRODUCT_CREATE',
  async (payload: void, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token

    if (!token) {
      throw new Error('no user login token')
    }
    const response = await fetch(`/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const product = data as IProductWithId
    return product
  }
)

export const updateProduct = createAsyncThunk<IProductWithId, IProductWithId>(
  'PRODUCT_UPDATE',
  async (payload: IProductWithId, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token

    if (!token) {
      throw new Error('no user login token')
    }
    const updatedProduct: ICreateProductInput = {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      category: payload.category,
      countInStock: payload.countInStock,
      image: payload.image,
      price: payload.price,
    } as ICreateProductInput

    const response = await fetch(`/api/products/${payload._id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProduct),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const product = data as IProductWithId
    return product
  }
)

export const createProductReview = createAsyncThunk<
  void,
  ICreateReviewInput & { productId: string }
>(
  'PRODUCT_CREATE_REVIEW',
  async (payload: ICreateReviewInput & { productId: string }, thunkAPI) => {
    const state: RootState = thunkAPI.getState()
    const userLogin: UserLoginState = state.userLogin
    const token = userLogin.userInfo?.token
    const { productId } = payload

    if (!token) {
      throw new Error('no user login token')
    }
    const response = await fetch(`/api/products/${productId}/reviews`, {
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
      state.page = 1
      state.pages = 1
    })
    builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products = payload.products
      state.pages = payload.pages
      state.page = payload.page
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

export interface ProductDeleteState {
  loading: boolean
  error?: string
  success: boolean
}

const initialProductDeleteState: ProductDeleteState = {
  loading: false,
  error: undefined,
  success: false,
}

export const productDeleteSlice = createSlice({
  name: 'productDelete',
  initialState: initialProductDeleteState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(deleteProduct.fulfilled, (state) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.success = false
    })
  },
})

export interface ProductCreateState {
  loading: boolean
  success?: boolean
  product?: IProductWithId
  error?: string
}

const initialProductCreateState: ProductCreateState = { loading: false }

export const productCreateSlice = createSlice({
  name: 'productCreate',
  initialState: initialProductCreateState,
  reducers: {
    reset: (state) => {
      state.error = undefined
      state.loading = false
      state.product = undefined
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(createProduct.fulfilled, (state, { payload }) => {
      state.loading = false
      state.success = true
      state.product = payload
    })
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface ProductUpdateState {
  loading: boolean
  success?: boolean
  product?: IProductWithId
  error?: string
}

const initialProductUpdateState: ProductUpdateState = { loading: false }

export const productUpdateSlice = createSlice({
  name: 'productUpdate',
  initialState: initialProductUpdateState,
  reducers: {
    reset: (state) => {
      state.error = undefined
      state.loading = false
      state.product = undefined
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
      state.loading = false
      state.success = true
      state.product = payload
    })
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface ProductCreateReviewState {
  loading: boolean
  success?: boolean
  error?: string
}

const initialProductCreateReviewState: ProductCreateReviewState = { loading: false }

export const createProductReviewSlice = createSlice({
  name: 'productCreateReview',
  initialState: initialProductCreateReviewState,
  reducers: {
    reset: (state) => {
      state.error = undefined
      state.loading = false
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProductReview.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(createProductReview.fulfilled, (state) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(createProductReview.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export type ProductTopRatedState = {
  loading: boolean
  products: IProductWithId[]
  error?: string
}

const initialProductTopRatedState: ProductTopRatedState = {
  loading: false,
  products: [],
}
export const productTopSlice = createSlice({
  name: 'productTop',
  initialState: initialProductTopRatedState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listTopProducts.pending, (state) => {
      state.loading = true
      state.products = []
      state.error = undefined
    })
    builder.addCase(listTopProducts.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products = payload
    })
    builder.addCase(listTopProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

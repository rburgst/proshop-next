import {
  CaseReducer,
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

import { IUserWithId, IUserWithToken } from '../../server/models/userModel'
import { RootState } from '../store'

// extra actions
export const logout = createAction<void>('LOGOUT')

// thunks

export const loginUser = createAsyncThunk<IUserWithToken, { email: string; password: string }>(
  'USER_LOGIN',
  async (args) => {
    const { email, password } = args
    const response = await fetch('/api/users/login', {
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    return data as IUserWithToken
  }
)

export const registerUser = createAsyncThunk<
  IUserWithToken,
  { name: string; email: string; password: string }
>('USER_REGISTER', async (args, thunkAPI) => {
  const { name, email, password } = args
  const response = await fetch('/api/users', {
    body: JSON.stringify({ email, password, name }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText)
  }
  const user = data as IUserWithToken
  thunkAPI.dispatch(userLoginSlice.actions.loginSuccess(user))
  return user
})

export const updateUser = createAsyncThunk<
  IUserWithId,
  { id: string; name: string; email: string; isAdmin: boolean }
>('USER_UPDATE', async (args, thunkAPI) => {
  const state: RootState = thunkAPI.getState() as RootState
  if (!state.userLogin.userInfo) {
    throw new Error('getUserDetails without logged in user')
  }
  const token = state.userLogin.userInfo.token

  const { id, name, email, isAdmin } = args
  const response = await fetch(`/api/users/${id}`, {
    body: JSON.stringify({ email, isAdmin, name }),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    method: 'PUT',
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText)
  }
  const user = data as IUserWithId
  return user
})

export const getUserDetails = createAsyncThunk<IUserWithId, string>(
  'USER_DETAILS',
  async (userId, thunkAPI) => {
    const finalId = userId ?? 'profile'
    const state: RootState = thunkAPI.getState() as RootState
    console.log('got root login state', state.userLogin)
    if (!state.userLogin.userInfo) {
      throw new Error('getUserDetails without logged in user')
    }
    const token = state.userLogin.userInfo.token

    const response = await fetch(`/api/users/${finalId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText)
    }
    const user = data as IUserWithId
    return user
  }
)

export const listUsers = createAsyncThunk<IUserWithId[]>('USER_LIST', async (args, thunkAPI) => {
  const state: RootState = thunkAPI.getState() as RootState
  if (!state.userLogin.userInfo) {
    throw new Error('listUsers without logged in user')
  }
  const token = state.userLogin.userInfo.token

  const response = await fetch(`/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText)
  }
  const users = data as IUserWithId[]
  return users
})

export const updateUserProfile = createAsyncThunk<
  IUserWithId,
  { name: string; email: string; password: string }
>('USER_PROFILE_UPDATE', async (user, thunkAPI) => {
  const { name, email, password } = user
  const state: RootState = thunkAPI.getState() as RootState
  const token = state.userLogin.userInfo.token

  const response = await fetch(`/api/users/profile`, {
    body: JSON.stringify({ email, password, name }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'PUT',
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText)
  }
  const updatedUser = data as IUserWithId
  thunkAPI.dispatch(userLoginSlice.actions.loginSuccess({ ...updatedUser, token }))
  return updatedUser
})

export const deleteUser = createAsyncThunk<boolean, string>(
  'USER_DELETE',
  async (userId, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState
    const token = state.userLogin.userInfo.token

    const response = await fetch(`/api/users/${userId}`, {
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

// slice
export interface UserLoginState {
  loading: boolean
  userInfo?: IUserWithToken
  error?: string
}

const initialUserLoginState: UserLoginState = {
  loading: false,
  userInfo: undefined,
  error: undefined,
}

const userLoginSuccess: CaseReducer<UserLoginState, PayloadAction<IUserWithToken>> = (
  state,
  action
) => {
  state.loading = false
  state.userInfo = action.payload
}

const userLogoutSuccess: CaseReducer<UserLoginState, PayloadAction<void>> = (state) => {
  state.userInfo = undefined
  state.error = undefined
}

export const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState: initialUserLoginState,
  reducers: {
    loginSuccess: userLoginSuccess,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, userLogoutSuccess)
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.userInfo = undefined
    })
    builder.addCase(loginUser.fulfilled, userLoginSuccess)
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface UserRegisterState {
  loading: boolean
  userInfo?: IUserWithToken
  error?: string
}

const initialUserRegisterState: UserRegisterState = {
  loading: false,
  userInfo: undefined,
  error: undefined,
}

export const userRegisterSlice = createSlice({
  name: 'userRegister',
  initialState: initialUserRegisterState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.userInfo = undefined
      state.error = undefined
    })
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.userInfo = undefined
    })
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface UserDetailsState {
  loading: boolean
  user?: IUserWithId
  error?: string
}

const initialUserDetailsState: UserDetailsState = {
  loading: false,
  user: undefined,
  error: undefined,
}

export const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: initialUserDetailsState,
  reducers: {
    reset: (state) => {
      state.error = undefined
      state.loading = false
      state.user = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.user = undefined
      state.error = undefined
    })
    builder.addCase(getUserDetails.pending, (state) => {
      state.loading = true
      state.user = undefined
      state.error = undefined
    })
    builder.addCase(getUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false
      state.user = payload
    })
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.loading = false
      state.user = payload
    })
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface UserUpdateProfileState {
  loading: boolean
  userInfo?: IUserWithId
  error?: string
  success: boolean
}

const initialUserUpdateProfileState: UserUpdateProfileState = {
  loading: false,
  userInfo: undefined,
  error: undefined,
  success: false,
}

export const userUpdateProfileSlice = createSlice({
  name: 'userUpdateProfile',
  initialState: initialUserUpdateProfileState,
  reducers: {
    reset: (state) => {
      state.userInfo = undefined
      state.error = undefined
      state.success = false
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.userInfo = undefined
      state.error = undefined
      state.success = false
    })
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true
      state.userInfo = undefined
      state.success = false
    })
    builder.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
      state.success = true
    })
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.success = false
    })
  },
})

export interface UserListState {
  loading: boolean
  users: IUserWithId[]
  error?: string
}

const initialUserListState: UserListState = {
  loading: false,
  users: [],
  error: undefined,
}

export const userListSlice = createSlice({
  name: 'userList',
  initialState: initialUserListState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.users = []
      state.error = undefined
    })
    builder.addCase(listUsers.pending, (state) => {
      state.loading = true
      state.users = []
      state.error = undefined
    })
    builder.addCase(listUsers.fulfilled, (state, { payload }) => {
      state.loading = false
      state.users = payload
    })
    builder.addCase(listUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export interface UserDeleteState {
  loading: boolean
  error?: string
  success: boolean
}

const initialUserDeleteState: UserDeleteState = {
  loading: false,
  error: undefined,
  success: false,
}

export const userDeleteSlice = createSlice({
  name: 'userDelete',
  initialState: initialUserDeleteState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      state.success = false
    })
  },
})

export interface UserUpdateState {
  loading: boolean
  success: boolean
  error?: string
}

const initialUserUpdateState: UserUpdateState = {
  loading: false,
  success: false,
  error: undefined,
}

export const userUpdateSlice = createSlice({
  name: 'userUpdate',
  initialState: initialUserUpdateState,
  reducers: {
    reset: (state) => {
      state.error = undefined
      state.loading = false
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(updateUser.fulfilled, (state) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

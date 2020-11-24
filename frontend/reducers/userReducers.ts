import {
  CaseReducer,
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IUser } from "../../server/models/userModel";

// extra actions
export const logout = createAction<void>("LOGOUT");

// thunks

export const loginUser = createAsyncThunk<
  IUser,
  { email: string; password: string }
>("USER_LOGIN", async (args, thunkAPI) => {
  const { email, password } = args;
  const response = await fetch("/api/users/login", {
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText);
  }
  return data as IUser;
});

export const registerUser = createAsyncThunk<
  IUser,
  { name: string; email: string; password: string }
>("USER_REGISTER", async (args, thunkAPI) => {
  const { name, email, password } = args;
  const response = await fetch("/api/users", {
    body: JSON.stringify({ email, password, name }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message ?? response.statusText);
  }
  const user = data as IUser;
  thunkAPI.dispatch(userLoginSlice.actions.loginSuccess(user));
  return user;
});

// slice
export interface UserLoginState {
  loading: boolean;
  userInfo?: IUser;
  error?: string;
}

const initialUserLoginState: UserLoginState = {
  loading: false,
  userInfo: undefined,
  error: undefined,
};

const userLoginSuccess: CaseReducer<UserLoginState, PayloadAction<IUser>> = (
  state,
  action
) => {
  state.loading = false;
  state.userInfo = action.payload;
};

const userLogoutSuccess: CaseReducer<UserLoginState, PayloadAction<void>> = (
  state
) => {
  state.userInfo = undefined;
  state.error = undefined;
};

export const userLoginSlice = createSlice({
  name: "userLogin",
  initialState: initialUserLoginState,
  reducers: {
    loginSuccess: userLoginSuccess,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, userLogoutSuccess);
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.userInfo = undefined;
    });
    builder.addCase(loginUser.fulfilled, userLoginSuccess);
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export interface UserRegisterState {
  loading: boolean;
  userInfo?: IUser;
  error?: string;
}

const initialUserRegisterState: UserRegisterState = {
  loading: false,
  userInfo: undefined,
  error: undefined,
};

export const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState: initialUserRegisterState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.userInfo = null;
      state.error = undefined;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.userInfo = undefined;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

import {
  CaseReducer,
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { IUser } from "../../server/models/userModel";
import { RootState } from "../store";

// extra actions
export const logout = createAction<void>("LOGOUT");

// thunks

export const loginUser = createAsyncThunk<
  IUserWithToken,
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
  return data as IUserWithToken;
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
  const user = data as IUserWithToken;
  thunkAPI.dispatch(userLoginSlice.actions.loginSuccess(user));
  return user;
});

export const getUserDetails = createAsyncThunk<IUser, string>(
  "USER_DETAILS",
  async (userId, thunkAPI) => {
    const finalId = userId ?? "profile";
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.userLogin.userInfo!.token;

    const response = await fetch(`/api/users/${finalId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? response.statusText);
    }
    const user = data as IUser;
    return user;
  }
);

export interface IUserWithToken extends IUser {
  token: string;
}
// slice
export interface UserLoginState {
  loading: boolean;
  userInfo?: IUserWithToken;
  error?: string;
}

const initialUserLoginState: UserLoginState = {
  loading: false,
  userInfo: undefined,
  error: undefined,
};

const userLoginSuccess: CaseReducer<
  UserLoginState,
  PayloadAction<IUserWithToken>
> = (state, action) => {
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

export interface UserDetailsState {
  loading: boolean;
  user?: IUser;
  error?: string;
}

const initialUserDetailsState: UserDetailsState = {
  loading: false,
  user: undefined,
  error: undefined,
};

export const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: initialUserDetailsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.user = null;
      state.error = undefined;
    });
    builder.addCase(getUserDetails.pending, (state) => {
      state.loading = true;
      state.user = undefined;
    });
    builder.addCase(getUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

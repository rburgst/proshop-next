import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../server/models/userModel";

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

export const userLoginSlice = createSlice({
  name: "userLogin",
  initialState: initialUserLoginState,
  reducers: {
    logout: (state, action: PayloadAction<void>) => {
      state = { loading: false };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.userInfo = undefined;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

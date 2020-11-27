import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  createStore,
  DeepPartial,
  EnhancedStore,
  getDefaultMiddleware,
  Reducer,
  ThunkAction,
} from "@reduxjs/toolkit";
import { ThunkMiddlewareFor } from "@reduxjs/toolkit/src/getDefaultMiddleware";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PersistConfig,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartSlice } from "./reducers/cartReducers";
import {
  productDetailsSlice,
  productListSlice,
} from "./reducers/productReducers";
import {
  userDetailsSlice,
  userLoginSlice,
  userRegisterSlice,
  userUpdateProfileSlice,
} from "./reducers/userReducers";
import { MakeStore, createWrapper, Context, HYDRATE } from "next-redux-wrapper";

export type StoreType = EnhancedStore<
  RootState,
  AnyAction,
  [ThunkMiddlewareFor<RootState>]
>;

let store: StoreType;

function optionalPersistReducer<S, A extends Action = AnyAction>(
  isServer: boolean,
  reducer: Reducer<S, A>,
  persistConfig: PersistConfig<S>
): Reducer<S, A> {
  return isServer ? reducer : persistReducer(persistConfig, reducer);
}

function createReducer(isServer: boolean): Reducer {
  const cartPersistConfig = {
    key: "cart",
    storage,
    whitelist: ["cartItems", "shippingAddress", "paymentMethod"], // place to select which state you want to persist
  };
  const userLoginPersistConfig = {
    key: "userLogin",
    storage,
    whitelist: ["userInfo"], // place to select which state you want to persist
  };
  const rootReducer = combineReducers({
    productList: productListSlice.reducer,
    productDetails: productDetailsSlice.reducer,
    cart: optionalPersistReducer(
      isServer,
      cartSlice.reducer,
      cartPersistConfig
    ),
    userLogin: optionalPersistReducer(
      isServer,
      userLoginSlice.reducer,
      userLoginPersistConfig
    ),
    userRegister: userRegisterSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    userUpdateProfile: userUpdateProfileSlice.reducer,
  });
  return rootReducer;
}

const dummyServerReducer = createReducer(true);

export type RootState = ReturnType<typeof dummyServerReducer>;

const makeStore = () => {
  const isServer = typeof window === "undefined";
  const store = (configureStore<RootState>({
    reducer: createReducer(isServer),
    // @ts-ignore: cant be bothered right now
    middleware: getDefaultMiddleware<RootState>({
      thunk: true,
      immutableCheck: true,
      // @ts-ignore: wrong typescript for this
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    devTools: true,
    //preloadedState: initialState,
  }) as unknown) as StoreType;

  if (!isServer) {
    // @ts-ignore: this will be ok
    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature
  }
  return store;
};

export const wrapper = createWrapper<RootState>(makeStore, { debug: true });

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

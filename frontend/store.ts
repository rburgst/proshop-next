import {
  AnyAction,
  combineReducers,
  configureStore,
  DeepPartial,
  EnhancedStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { cartSlice } from "./reducers/cartReducers";
import {
  productListSlice,
  productDetailsSlice,
} from "./reducers/productReducers";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useMemo } from "react";
import { ThunkMiddlewareFor } from "@reduxjs/toolkit/src/getDefaultMiddleware";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

export type StoreType = EnhancedStore<
  RootState,
  AnyAction,
  [ThunkMiddlewareFor<RootState>]
>;

let store: StoreType;

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["cartItems"], // place to select which state you want to persist
};
const rootReducer = combineReducers({
  productList: productListSlice.reducer,
  productDetails: productDetailsSlice.reducer,
  cart: persistReducer(cartPersistConfig, cartSlice.reducer),
});

export type RootState = ReturnType<typeof rootReducer>;

const rootPersistConfig = {
  key: "root",
  storage,
  blacklist: ["cart"], // place to select which state you want to persist
};

// const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

function makeStore(initialState: DeepPartial<RootState>): StoreType {
  const enhancedStore = (configureStore<RootState>({
    reducer: rootReducer,
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
    preloadedState: initialState,
  }) as unknown) as StoreType;
  return enhancedStore;
}

export const initializeStore = (
  preloadedState: DeepPartial<RootState>
): StoreType => {
  let _store: StoreType = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    let combinedInitialState = {
      ...store.getState(),
      ...preloadedState,
    } as DeepPartial<RootState>;
    _store = makeStore(combinedInitialState);
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: DeepPartial<RootState>) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
  Reducer,
  ThunkAction,
} from '@reduxjs/toolkit'
import { ThunkMiddlewareFor } from '@reduxjs/toolkit/src/getDefaultMiddleware'
import { createWrapper } from 'next-redux-wrapper'
import { useDispatch } from 'react-redux'
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
} from 'redux-persist'
import { PersistPartial } from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'

import { cartSlice } from './reducers/cartReducers'
import {
  orderCreateSlice,
  orderDetailsSlice,
  orderListMySlice,
  orderPaySlice,
} from './reducers/orderReducers'
import {
  ProductDeleteSlice,
  productDetailsSlice,
  productListSlice,
} from './reducers/productReducers'
import {
  userDeleteSlice,
  userDetailsSlice,
  userListSlice,
  userLoginSlice,
  userRegisterSlice,
  userUpdateProfileSlice,
  userUpdateSlice,
} from './reducers/userReducers'

export type StoreType = EnhancedStore<RootState, AnyAction, [ThunkMiddlewareFor<RootState>]>

let store: StoreType

function optionalPersistReducer<S, A extends Action = AnyAction>(
  isServer: boolean,
  reducer: Reducer<S, A>,
  persistConfig: PersistConfig<S>
): Reducer<S, A> | Reducer<S & PersistPartial, A> {
  return isServer ? reducer : persistReducer(persistConfig, reducer)
}

function createReducer(isServer: boolean): Reducer {
  const cartPersistConfig = {
    key: 'cart',
    storage,
    whitelist: ['cartItems', 'shippingAddress', 'paymentMethod'], // place to select which state you want to persist
  }
  const userLoginPersistConfig = {
    key: 'userLogin',
    storage,
    whitelist: ['userInfo'], // place to select which state you want to persist
  }
  const rootReducer = combineReducers({
    productList: productListSlice.reducer,
    productDetails: productDetailsSlice.reducer,
    productDelete: ProductDeleteSlice.reducer,
    cart: optionalPersistReducer(isServer, cartSlice.reducer, cartPersistConfig),
    userLogin: optionalPersistReducer(isServer, userLoginSlice.reducer, userLoginPersistConfig),
    userRegister: userRegisterSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    userUpdate: userUpdateSlice.reducer,
    userList: userListSlice.reducer,
    userDelete: userDeleteSlice.reducer,
    userUpdateProfile: userUpdateProfileSlice.reducer,
    orderCreate: orderCreateSlice.reducer,
    orderDetails: orderDetailsSlice.reducer,
    orderPay: orderPaySlice.reducer,
    orderListMy: orderListMySlice.reducer,
  })
  return rootReducer
}

const dummyServerReducer = createReducer(true)

export type RootState = ReturnType<typeof dummyServerReducer>

const makeStore = (): StoreType => {
  const isServer = typeof window === 'undefined'
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
  }) as unknown) as StoreType

  if (!isServer) {
    // @ts-ignore: this will be ok
    store.__persistor = persistStore(store) // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature
  }
  return store
}

export const wrapper = createWrapper<RootState>(makeStore, { debug: true })

export type AppDispatch = typeof store.dispatch

// eslint-disable-next-line
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

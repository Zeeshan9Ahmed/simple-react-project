import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';
import usersReducer from './slices/userSlice';
import axios from 'axios';
const persistedReducer = persistReducer(persistConfig, usersReducer);

export const Store = configureStore({
  reducer: {
    users: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export const persistor = persistStore(Store);

persistor.subscribe(() => {
  const persistedState = Store.getState();
  const { user } = persistedState?.users || {};
  console.log(persistedState?.users?.user?.token)
  axios.defaults.headers.common['Authorization'] = user?.token
});
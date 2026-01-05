import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authState";
import { indexSlice } from "./features/indexSlice";
import { profileApi } from "./features/profileSlice";
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
    [indexSlice.reducerPath]: indexSlice.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(indexSlice.middleware, profileApi.middleware),
});
export const persistor = persistStore(store);
export default store;

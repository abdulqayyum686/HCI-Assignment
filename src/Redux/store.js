import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import userReducer from "./user";
import taskReducer from "./task";
///reducers
const reducer = combineReducers({
  userReducer: userReducer,
  taskReducer: taskReducer,
});
const presistConfig = {
  key: "root",
  storage,
  // whitelist: [],
  whitelist: ["userReducer"],
  // , "userReducer","
};

const persistedReducer = persistReducer(presistConfig, reducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: [thunk],
// });
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

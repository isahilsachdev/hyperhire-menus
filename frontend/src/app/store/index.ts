import { configureStore } from "@reduxjs/toolkit";
import treeReducer from "./slices/treeSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    tree: treeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;

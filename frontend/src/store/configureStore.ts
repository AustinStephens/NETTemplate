import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../components/account/accountSlice";
import { basketSlice } from "../components/baskets/basketSlice";
import { catalogSlice } from "../components/catalog/catalogSlice";

export const store = configureStore({
    reducer: {
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
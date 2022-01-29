import { createAsyncThunk, createEntityAdapter, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { Order } from "../../models/order";
import { RootState } from "../../store/configureStore";

interface OrdersState {
    ordersLoaded: boolean;
    status: string;
}

const ordersAdapter = createEntityAdapter<Order>();

export const fetchOrdersAsync = createAsyncThunk<Order[], void, {state: RootState}>(
    'orders/fetchOrdersAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Order.list();
        } catch (e: any) {
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
)

export const fetchOrderAsync = createAsyncThunk<Order, number>(
    'orders/fetchOrderAsync',
    async (orderId, thunkAPI) => {
        try {
            return await agent.Order.fetch(orderId);
        } catch (e: any) {
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
)

export const createOrderAsync = createAsyncThunk<string, any>(
    'orders/createOrderAsync',
    async (order, thunkAPI) => {
        try {
            return await agent.Order.create(order);
        } catch(e: any) {
            return thunkAPI.rejectWithValue({error: e.data});
        }
    }
);

export const orderSlice = createSlice({
    name: 'order',
    initialState: ordersAdapter.getInitialState<OrdersState>({
        ordersLoaded: false,
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchOrdersAsync.pending, (state) => {
            state.status = 'pendingFetchOrders';
        });
        builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
            ordersAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.ordersLoaded = true;
        });
        builder.addCase(fetchOrderAsync.pending, (state) => {
            state.status = 'pendingFetchOrder';
        });
        builder.addCase(fetchOrderAsync.fulfilled, (state, action) => {
            ordersAdapter.upsertOne(state, action.payload)
            state.status = 'idle';
        });
        builder.addCase(createOrderAsync.pending, (state) => {
            state.status = 'pendingCreateOrder';
        });
        builder.addCase(createOrderAsync.fulfilled, (state, action) => {
            state.ordersLoaded = false;
            fetchOrdersAsync();
        });
        builder.addMatcher(isAnyOf(createOrderAsync.rejected, fetchOrdersAsync.rejected, fetchOrderAsync.rejected), (state) => {
            state.status = 'idle';
        });
    })
})

export const orderSelectors = ordersAdapter.getSelectors((state: RootState) => state.orders);
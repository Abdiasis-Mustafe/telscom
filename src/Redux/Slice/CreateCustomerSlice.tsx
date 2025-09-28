import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface createCustomerData {
    customer_name: string,
    customer_phone: string,
    customer_address: string,
    company_id: string;
}

const initialState = {
    data: [],
    IsSuccess: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
};

export const createCustomerFn = createAsyncThunk(
    'createCustomer',
    async (data: createCustomerData[], { rejectWithValue }) => {
        try {
            const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;

            // Add company_id to each vendor data
            const Data = data.map(Customer => ({
                ...Customer,
                company_id: Company_Id
            }));

            // Send the array of vendor data
            const response = await axios.post(`${Url}/customers`, Data);

            return response.data;
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const createCustomerSlice = createSlice({
    name: 'create/Customer',
    initialState,
    reducers: { resetCustomer: () => initialState },
    extraReducers: (builder) => {
        builder
            .addCase(createCustomerFn.pending, (state) => {
                state.isLoading = true;
                state.IsSuccess = false;
                state.isError = false;
                state.errorMsg = '';
            })
            .addCase(createCustomerFn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.IsSuccess = true;
                state.data = action.payload;
            })
            .addCase(createCustomerFn.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMsg = action.payload as string;
            });
    },
});

export const { resetCustomer } = createCustomerSlice.actions;


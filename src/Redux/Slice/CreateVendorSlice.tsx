import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface createVendorData {
    vendor_name: string;
    vendor_address: string;
    vendor_email: string;
    vendor_phone: string;
    company_id: string;
}

const initialState = {
    data: [],
    IsSuccess: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
};

export const createVendorFn = createAsyncThunk(
    'createVendor',
    async (data: createVendorData[], { rejectWithValue }) => {
        try {
            const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;

            // Add company_id to each vendor data
            const vendorsWithCompanyId = data.map(vendor => ({
                ...vendor,
                company_id: Company_Id
            }));

            // Send the array of vendor data
            const response = await axios.post(`${Url}/vendors`, vendorsWithCompanyId);

            return response.data;
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const createVendorSlice = createSlice({
    name: 'create/Vendor',
    initialState,
    reducers: { resetVendor: () => initialState },
    extraReducers: (builder) => {
        builder
            .addCase(createVendorFn.pending, (state) => {
                state.isLoading = true;
                state.IsSuccess = false;
                state.isError = false;
                state.errorMsg = '';
            })
            .addCase(createVendorFn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.IsSuccess = true;
                state.data = action.payload;
            })
            .addCase(createVendorFn.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMsg = action.payload as string;
            });
    },
});

export const { resetVendor } = createVendorSlice.actions;

export default createVendorSlice.reducer;

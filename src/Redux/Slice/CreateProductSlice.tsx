import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface createProductData {
    product_code: string;
    product_name: string;
    product_alert_number: number;
    product_cost: string;
    product_price: string;
    company_id:string;
}

const initialState = {
    data: [],
    IsSuccess: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
};

export const createProductFn = createAsyncThunk(
    'createProduct',
    async (data: createProductData[], { rejectWithValue }) => {
        try {
            const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;

            // Add company_id to each vendor data
            const CreateProData = data.map(product => ({
                ...product,
                company_id: Company_Id
            }));
               console.log(CreateProData)
            // Send the array of vendor data
            const response = await axios.post(`${Url}/products`, CreateProData);

            return response.data;
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const createProductSlice = createSlice({
    name: 'create/product',
    initialState,
    reducers: { resetProduct: () => initialState },
    extraReducers: (builder) => {
        builder
            .addCase(createProductFn.pending, (state) => {
                state.isLoading = true;
                state.IsSuccess = false;
                state.isError = false;
                state.errorMsg = '';
            })
            .addCase(createProductFn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.IsSuccess = true;
                state.data = action.payload;
            })
            .addCase(createProductFn.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMsg = action.payload as string;
            });
    },
});

export const { resetProduct } = createProductSlice.actions;
export default createProductSlice.reducer;



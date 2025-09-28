import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface createSalaryData {
    paid_amount:string
    date:string
    employee_id:number
}

const initialState = {
    data: {} as createSalaryData ,
    IsSuccess: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
};

export const createSalaryFn = createAsyncThunk(
    'createSale',
    async (data: createSalaryData, { rejectWithValue }) => {
        try {
            const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;

            // Add company_id to each vendor data
            const Data = {
                ...data,
                Company_Id
            }
            // Send the array of vendor data
            const response = await axios.post(`${Url}/salaries`, Data);

            return response.data;
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const createSalarySlice = createSlice({
    name: 'create/Sale',
    initialState,
    reducers: { resetSalary: () => initialState },
    extraReducers: (builder) => {
        builder
            .addCase(createSalaryFn.pending, (state) => {
                state.isLoading = true;
                state.IsSuccess = false;
                state.isError = false;
                state.errorMsg = '';
            })
            .addCase(createSalaryFn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.IsSuccess = true;
                state.data = action.payload;
            })
            .addCase(createSalaryFn.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMsg = action.payload as string;
            });
    },
});

export const { resetSalary } = createSalarySlice.actions;
;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface createCompanyData {
    company_name: string;
    company_address: string;
    company_email: string;
    company_phone:string;
    // vendor_phone: string;
    taxable: boolean;
    tax_percentage:number
    subscribtion_fee:number
}

const initialState = {
    data: [],
    IsSuccess: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
};

export const createCompaniesFn = createAsyncThunk(
    'createCompany',
    async (data: createCompanyData, { rejectWithValue }) => {
        try {
            // const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;

            // Add company_id to each vendor data
            // const vendorsWithCompanyId = data.map(vendor => ({
            //     ...vendor,
            //     // company_id: Company_Id
            // }));

            // Send the array of vendor data
            const token = JSON.parse(localStorage.getItem('userInfo')!).accessToken;
            const response = await axios.post(`${Url}/companies`, data,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
              });

            return response.data;
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const createCompanySlice = createSlice({
    name: 'create/Vendor',
    initialState,
    reducers: { resetCompany: () => initialState },
    extraReducers: (builder) => {
        builder
            .addCase(createCompaniesFn.pending, (state) => {
                state.isLoading = true;
                state.IsSuccess = false;
                state.isError = false;
                state.errorMsg = '';
            })
            .addCase(createCompaniesFn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.IsSuccess = true;
                state.data = action.payload;
            })
            .addCase(createCompaniesFn.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMsg = action.payload as string;
            });
    },
});

export const { resetCompany } = createCompanySlice.actions;



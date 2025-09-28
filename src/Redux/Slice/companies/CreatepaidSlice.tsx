import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";


interface paydata {
    amount_paid:string
    months_covered:number
    company_id :string
}
export interface createpaymentData {
            id: number,
            company_id: string,
            expected_amount: string,
            amount_paid: string,
            payment_date: string,
            start_date: string,
            end_date: string,
            months_covered: number,
            created_at: string,
            updated_at: string,
            company: {
                company_id: string,
                company_name: string,
                company_address: string,
                company_phone: string,
                company_email: string,
                isBanned: boolean,
                subscribtion_fee: string,
                subscription_end_date: string,
                taxable: boolean,
                tax_percentage: number,
                debt: string,
                created_at: string,
                updated_at: string,
                created_by:null
            }
}

const initialState = {
    data: [],
    IsSuccess: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
};

export const createPaidFn = createAsyncThunk(
    'createCompany',
    async (data:paydata, { rejectWithValue }) => {
        try {
            // const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;

            // Add company_id to each vendor data
            // const vendorsWithCompanyId = data.map(vendor => ({
            //     ...vendor,
            //     // company_id: Company_Id
            // }));

            // Send the array of vendor data
            const token = JSON.parse(localStorage.getItem('userInfo')!).accessToken;
            const response = await axios.post(`${Url}/paid/`, data,{
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

export const createPaymentSlice = createSlice({
    name: 'create/payment',
    initialState,
    reducers: { resetPayment: () => initialState },
    extraReducers: (builder) => {
        builder
            .addCase(createPaidFn.pending, (state) => {
                state.isLoading = true;
                state.IsSuccess = false;
                state.isError = false;
                state.errorMsg = '';
            })
            .addCase(createPaidFn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.IsSuccess = true;
                state.data = action.payload;
            })
            .addCase(createPaidFn.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMsg = action.payload as string;
            });
    },
});

export const { resetPayment } = createPaymentSlice.actions;



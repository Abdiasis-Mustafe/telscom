import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface UpdatepaymentData {
    id:number
    amount_paid:String
    months_covered: number,
    company_id: string,
    
   
}

const initialState = {
  data: null,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: '',
};

export const UpdatePaymentFn = createAsyncThunk(
  'UpdatePayment',
  async (data: UpdatepaymentData, { rejectWithValue }) => {
    try {
    //   const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;
      const id=data.id
      const employeeWithCompanyId = {
        ...data,
          // id: data.vendor_id
      };
      const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      const response = await axios.put(`${Url}/paid/${id}`, employeeWithCompanyId,{
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

export const UpdatepaymentSlice = createSlice({
  name: 'UpdatePayment',
  initialState,
  reducers: { resetpaymentUpdates: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(UpdatePaymentFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = '';
      })
      .addCase(UpdatePaymentFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(UpdatePaymentFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetpaymentUpdates } = UpdatepaymentSlice.actions;


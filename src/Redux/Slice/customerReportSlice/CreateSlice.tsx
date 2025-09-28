import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";


export interface MetricInput {
  service_id: number;
  active_users: number;
  target_value: number;
}

export interface CreateCustomerReportData {
  month: number;
  year: number;
 total_customers?: number;
  growth_rate?: number;
  churn_rate?: number;
  metrics: MetricInput[];
}

interface CustomerReportState {
  data: any;
  IsSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
}


const initialState: CustomerReportState = {
  data: null,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};


export const createCustomerReportFn = createAsyncThunk(
  "customerReports/create",
  async (data: CreateCustomerReportData[], { rejectWithValue }) => {
    try {
      const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;

      
      const payload = data.map((r) => ({
        ...r,
        company_id: Company_Id,
      }));

      const response = await axios.post(`${Url}/customers`, payload,{headers: { Authorization: `Bearer ${token}` }});

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue(error.response?.data.message || errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);


export const createCustomerReportSlice = createSlice({
  name: "create/customerReport",
  initialState,
  reducers: {
    resetCustomerReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomerReportFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(createCustomerReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(createCustomerReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetCustomerReport } = createCustomerReportSlice.actions;
export default createCustomerReportSlice.reducer;

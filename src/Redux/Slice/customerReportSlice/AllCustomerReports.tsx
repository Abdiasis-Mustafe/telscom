import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Interfaces
export interface CustomerMetric {
  id: number;
  report_id: number;
  service_id: number;
  active_users: number;
  target_value: number;
}

export interface CustomerReport {
  id: number;
  customer_id: number | null;
  company_id: string;
  month: number;
  year: number;
  growth_rate: number;
  churn_rate: number;
  total_customers: number;
  created_at: string;
  updated_at: string;
  metrics: CustomerMetric[];
}

export interface CustomerReportResponse {
  data: CustomerReport[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CustomerReportState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMsg: string;
  data: CustomerReport[];
  total: number;
  page: number;
  pageSize: number;
}

const initialState: CustomerReportState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  data: [],
  total: 0,
  page: 1,
  pageSize: 10,
};

// Async Thunk with page, pageSize, search
export const GetAllCustomerFn = createAsyncThunk<
  CustomerReportResponse,
  { page?: number; pageSize?: number; search?: string }
>("AllCustomer/fetch", async ({ page = 1, pageSize = 10, search = "" }, { rejectWithValue }) => {
  try {
    const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;
    const res = await axios.get<CustomerReportResponse>(`${Url}/customers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, pageSize, search },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) return rejectWithValue(error.response?.data.message || errorMsg);
    return rejectWithValue(errorMsg);
  }
});

export const GetAllCustomerSlice = createSlice({
  name: "GetAllCustomersR",
  initialState,
  reducers: {
    resetAllCustomers: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCustomerFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMsg = "";
      })
      .addCase(GetAllCustomerFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(GetAllCustomerFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = String(action.payload);
      });
  },
});

export const { resetAllCustomers } = GetAllCustomerSlice.actions;
export default GetAllCustomerSlice.reducer;

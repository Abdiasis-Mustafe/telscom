// src/Redux/Slice/customerReportSlice/singleCustomerReportSlice.ts
import { Url } from "@/Interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface CustomerMetric {
  service_id: number;
  active_users: number;
  target_value: number;
}

export interface CustomerReport {
  id: number;
  month: number;
  year: number;
  total_customers: number;
  growth_rate: number;
  churn_rate: number;
  metrics: CustomerMetric[];
}

interface SingleCustomerState {
  data: CustomerReport | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SingleCustomerState = {
  data: null,
  isLoading: false,
  error: null,
};

// ✅ Thunk to fetch single customer report
export const GetSingleCustomerFn = createAsyncThunk(
  "customerReport/getSingle",
  async (id: number, { rejectWithValue }) => {
    try {
      const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      const res = await axios.get(`${Url}/customers/${id}`,{  headers: {
                    Authorization: `Bearer ${token}`,
                },}); // adjust backend route
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customer report");
    }
  }
);

export const singleCustomerReportSlice = createSlice({
  name: "GetSingleCustomerR",
  initialState,
  reducers: {
    resetSingleCustomer: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetSingleCustomerFn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetSingleCustomerFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(GetSingleCustomerFn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSingleCustomer } = singleCustomerReportSlice.actions;


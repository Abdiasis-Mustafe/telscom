import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Customer Report update input type
export interface UpdateCustomerReportData {
  id: number; // report id
  year?: number;
  month?: number;
  total_customers?: number;
  growth_rate?: number;
  churn_rate?: number;
  metrics?: {
    service_id: number;
    active_users: number;
    target_value: number;
  }[];
}

const initialState = {
  data: null as any,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};

export const updateCustomerReportFn = createAsyncThunk(
  "updateCustomerReport",
  async (data: UpdateCustomerReportData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;

      const response = await axios.put(
        `${Url}/customers/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateCustomerReportSlice = createSlice({
  name: "update/customerReport",
  initialState,
  reducers: {
    resetUpdateCustomerReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCustomerReportFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(updateCustomerReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(updateCustomerReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetUpdateCustomerReport } = updateCustomerReportSlice.actions;


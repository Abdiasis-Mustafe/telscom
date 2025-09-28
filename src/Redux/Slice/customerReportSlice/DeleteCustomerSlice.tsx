import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Delete Customer Report input type
export interface DeleteCustomerReportData {
  id: number; // report id
}

const initialState = {
  data: null as any,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};

export const deleteCustomerReportFn = createAsyncThunk(
  "deleteCustomerReport",
  async (data: DeleteCustomerReportData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;

      const response = await axios.delete(`${Url}/customers/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

export const deleteCustomerReportSlice = createSlice({
  name: "delete/customerReport",
  initialState,
  reducers: {
    resetDeleteCustomerReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCustomerReportFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(deleteCustomerReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(deleteCustomerReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetDeleteCustomerReport } = deleteCustomerReportSlice.actions;

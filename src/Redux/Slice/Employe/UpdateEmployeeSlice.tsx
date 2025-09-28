import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface UpdateEmployeeReportData {
  report_id: number;
  month: number;
  year: number;
  new_employees: number;
  left_employees: number;
  death: number;
  serious_illness: number;
  avg_performance: number;
  company_id?: string;
}

const initialState = {
  data: null as UpdateEmployeeReportData | null,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};

// Thunk to update a report
export const updateEmployeeReportFn = createAsyncThunk(
  "update/EmployeeReport",
  async (report: UpdateEmployeeReportData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      const res = await axios.put(
        `${Url}/employees/${report.report_id}`,
        report,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateEmployeeReportSlice = createSlice({
  name: "update/EmployeeReport",
  initialState,
  reducers: {
    resetUpdateEmployeeReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEmployeeReportFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.IsSuccess = false;
        state.errorMsg = "";
      })
      .addCase(updateEmployeeReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(updateEmployeeReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetUpdateEmployeeReport } = updateEmployeeReportSlice.actions;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Frontend type for creating an Employee Report
export interface CreateEmployeeReportData {
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
  data: [] as any[],
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: '',
};

// Thunk to create employee reports (single or multiple)
export const createEmployeeReportFn = createAsyncThunk(
  'create/EmployeeReport',
  async (reports: CreateEmployeeReportData[], { rejectWithValue }) => {
    try {
      const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).user.company_id;
           const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      // Add company_id to each report
      const Data = reports.map(report => ({
        ...report,
        company_id: report.company_id || Company_Id
      }));

      const response = await axios.post(`${Url}/employees`, Data,{
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

export const createEmployeeReportSlice = createSlice({
  name: 'create/EmployeeReport',
  initialState,
  reducers: { 
    resetEmployeeReport: () => initialState 
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployeeReportFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = '';
      })
      .addCase(createEmployeeReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(createEmployeeReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetEmployeeReport } = createEmployeeReportSlice.actions;

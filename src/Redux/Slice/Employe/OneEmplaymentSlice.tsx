import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";


export interface EmployeeReportData {
  report_id: number;
  company_id?: string | null;
  month: number;
  year: number;
  new_employees: number;
  left_employees: number;
  death: number;
  serious_illness: number;
  avg_performance?: number;
  created_at: string;
  updated_at: string;
  company?: {
    company_id: string;
    company_name: string;
    company_address?: string;
    company_phone?: string;
    company_email?: string;
  };
}

interface EmployeeReportState {
  byId: Record<number, EmployeeReportData>;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
}

const initialState: EmployeeReportState = {
  byId: {},
  isLoading: false,
  isError: false,
  errorMsg: "",
};

// Async thunk to fetch a single employee report by ID
export const getSingleEmployeeReport = createAsyncThunk(
  "employeeReport/getOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      const res = await axios.get(`${Url}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as EmployeeReportData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

// Slice
export const employeeReportSlice = createSlice({
  name: "employeeReport",
  initialState,
  reducers: {
    resetEmployeeReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getSingleEmployeeReport.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMsg = "";
    });
    builder.addCase(getSingleEmployeeReport.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.byId[action.payload.report_id] = action.payload;
    });
    builder.addCase(getSingleEmployeeReport.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = String(action.payload);
    });
  },
});

export const { resetEmployeeReport } = employeeReportSlice.actions;
 

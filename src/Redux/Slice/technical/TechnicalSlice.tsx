import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// ---------------- Types ----------------
export interface Achievement {
  title: string;
  description?: string;
}

export interface Challenge {
  title: string;
  description?: string;
}

export interface TechnicalReport {
  id?: number;
  company_id: string;
  month: number;
  year: number;
  achievements: Achievement[];
  challenges: Challenge[];
  created_at?: string;
}

export interface PaginatedResponse {
  data: TechnicalReport[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ---------------- State ----------------
const initialState = {
  reports: [] as TechnicalReport[],
  singleReport: null as TechnicalReport | null,
  total: 0,
  page: 1,
  pageSize: 10,
  hasMore: false,

  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMsg: "",
};

// ---------------- Helpers ----------------
const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem("userInfo")!)?.accessToken;
  return { Authorization: `Bearer ${token}` };
};

// ---------------- Thunks ----------------
export const fetchAllTechnicalReports = createAsyncThunk(
  "technicalReports/fetchAll",
  async (
    { 
      page = 1, 
      pageSize = 10, 
      search = "" 
    }: { 
      page?: number; 
      pageSize?: number; 
      search?: string 
    },
    { rejectWithValue }
  ) => {
    try {
      // Build query parameters
      const params: any = {
        page,
        pageSize
      };
      
      // Add search parameter only if it's not empty
      if (search && search.trim() !== "") {
        params.search = search.trim();
      }

      const response = await axios.get<PaginatedResponse>(
        `${Url}/technical`,
        { 
          headers: getAuthHeaders(),
          params 
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchTechnicalReport = createAsyncThunk(
  "technicalReports/fetchOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<TechnicalReport>(
        `${Url}/technical/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const createTechnicalReportFn = createAsyncThunk(
  "technicalReports/create",
  async (data: TechnicalReport, { rejectWithValue }) => {
    try {
      const response = await axios.post<TechnicalReport>(
        `${Url}/technical`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateTechnicalReportFn = createAsyncThunk(
  "technicalReports/update",
  async (
    { id, data }: { id: number; data: Partial<TechnicalReport> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<TechnicalReport>(
        `${Url}/technical/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteTechnicalReportFn = createAsyncThunk(
  "technicalReports/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${Url}/technical/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

// ---------------- Slice ----------------
export const technicalReportsSlice = createSlice({
  name: "technicalReports",
  initialState,
  reducers: {
    resetTechnicalReports: () => initialState,
    clearError: (state) => {
      state.isError = false;
      state.errorMsg = "";
    },
    clearSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // fetch all
    builder
      .addCase(fetchAllTechnicalReports.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMsg = "";
      })
      .addCase(fetchAllTechnicalReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchAllTechnicalReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });

    // fetch one
    builder
      .addCase(fetchTechnicalReport.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.singleReport = null;
      })
      .addCase(fetchTechnicalReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleReport = action.payload;
      })
      .addCase(fetchTechnicalReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });

    // create
    builder
      .addCase(createTechnicalReportFn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTechnicalReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports.unshift(action.payload); // add new report
      })
      .addCase(createTechnicalReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });

    // update
    builder
      .addCase(updateTechnicalReportFn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTechnicalReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = state.reports.map((r) =>
          r.id === action.payload.id ? action.payload : r
        );
      })
      .addCase(updateTechnicalReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });

    // delete
    builder
      .addCase(deleteTechnicalReportFn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTechnicalReportFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = state.reports.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteTechnicalReportFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetTechnicalReports, clearError, clearSuccess } = technicalReportsSlice.actions;
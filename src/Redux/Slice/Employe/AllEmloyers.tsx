import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Interface for an employee
export interface EmployeeData {
  employee_id: number;
  employee_name: string;
  employee_address: string;
  employee_phone: string;
  salary_amount: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Redux state interface
interface EmployeesState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMsg: string;
  data: EmployeeData[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  search: string;
}

const initialState: EmployeesState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  data: [],
  total: 0,
  page: 1,
  pageSize: 10,
  hasMore: false,
  search: "",
};

// Async thunk to fetch employees with pagination & search
export const getAllEmployersFn = createAsyncThunk<
  {
    data: EmployeeData[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  },
  { page: number; pageSize: number; search?: string },
  { rejectValue: string }
>(
  "employees/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
      const token = userInfo.accessToken;
      const companyId = userInfo.user.company_id;

      const res = await axios.get(`${Url}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          company_id: companyId,
          page: params.page,
          pageSize: params.pageSize,
          search: params.search || "",
        },
        withCredentials: true,
      });

      return res.data; // { data, total, page, pageSize, hasMore }
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue(error.response?.data?.message || errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetAllEmployeesSlice = createSlice({
  name: "getAllEmployees",
  initialState,
  reducers: {
    resetAllEmployees: (state) => Object.assign(state, initialState),
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // reset page on search
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployersFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllEmployersFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(getAllEmployersFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = String(action.payload || "Something went wrong");
      });
  },
});

export const { resetAllEmployees, setPage, setSearch, setPageSize } = GetAllEmployeesSlice.actions;


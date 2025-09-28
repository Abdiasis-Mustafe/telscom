import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Interface for a service
export interface ServiceData {
  service_id: number;
  name: string;
  description?: string;
  company_id: string;
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

// Redux state interface
interface ServicesState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMsg: string;
  data: ServiceData[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  search: string;
}

const initialState: ServicesState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  data: [],
  total: 0,
  page: 1,
  pageSize: 20,
  hasMore: false,
  search: "",
};

export const getAllServicesFn = createAsyncThunk<
  {
    data: ServiceData[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  },
  { page: number; pageSize: number; search?: string },
  { rejectValue: string }
>(
  "services/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
      const token = userInfo.accessToken;

      const res = await axios.get(`${Url}/services/All`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: params.page,
          pageSize: params.pageSize,
          search: params.search || "",
        },
        withCredentials: true,
      });

      return res.data; // now returns { data, total, page, pageSize, hasMore }
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue(error.response?.data.message || errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetAllServicesSlice = createSlice({
  name: "getAllServices",
  initialState,
  reducers: {
    resetAllServices: (state) => Object.assign(state, initialState),
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // reset page on search
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllServicesFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllServicesFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(getAllServicesFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = String(action.payload || "Something went wrong");
      });
  },
});

export const { resetAllServices, setPage, setSearch } = GetAllServicesSlice.actions;
export default GetAllServicesSlice.reducer;

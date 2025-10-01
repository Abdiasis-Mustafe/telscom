import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";


export interface RegionData {
  region_id: number;
  region_name: string;
  created_at: string;
  updated_at: string;
}


interface RegionsState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMsg: string;
  data: RegionData[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  search: string;
}

const initialState: RegionsState = {
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


export const getAllRegionsFn = createAsyncThunk<
  {
    data: RegionData[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  },
  { page: number; pageSize: number; search?: string },
  { rejectValue: string }
>(
  "regions/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
      const token = userInfo.accessToken;

      const res = await axios.get(`${Url}/region`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: params.page,
          pageSize: params.pageSize,
          search: params.search || "",
        },
        withCredentials: true,
      });

      return res.data; 
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue(error.response?.data.message || errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetAllRegionsSlice = createSlice({
  name: "getAllRegions",
  initialState,
  reducers: {
    resetAllRegions: (state) => Object.assign(state, initialState),
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRegionsFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllRegionsFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(getAllRegionsFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = String(action.payload || "Something went wrong");
      });
  },
});

export const { resetAllRegions, setPage, setSearch } = GetAllRegionsSlice.actions;


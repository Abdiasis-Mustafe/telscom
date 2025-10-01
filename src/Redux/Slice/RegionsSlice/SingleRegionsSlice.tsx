import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Region type
export interface RegionData {
  region_id: number;
  region_name: string;
  created_at: string;
  updated_at: string;
}

// State type
interface RegionState {
  byId: Record<number, RegionData>;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
}

const initialState: RegionState = {
  byId: {},
  isLoading: false,
  isError: false,
  errorMsg: "",
};

// Async thunk to fetch a single region
export const getSingleRegionFn = createAsyncThunk(
  "regions/getOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      const res = await axios.get(`${Url}/region/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as RegionData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

// Slice
export const getOneRegionSlice = createSlice({
  name: "getOneRegion",
  initialState,
  reducers: {
    resetOneRegion: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getSingleRegionFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMsg = "";
    });
    builder.addCase(getSingleRegionFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.byId[action.payload.region_id] = action.payload;
    });
    builder.addCase(getSingleRegionFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = String(action.payload);
    });
  },
});

export const { resetOneRegion } = getOneRegionSlice.actions;

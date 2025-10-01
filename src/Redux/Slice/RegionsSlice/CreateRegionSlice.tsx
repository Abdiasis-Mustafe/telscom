import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Region input type
export interface CreateRegionData {
  region_name: string;
}

const initialState = {
  data: [] as any[],
  isSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};

// Async thunk to create region(s)
export const createRegionFn = createAsyncThunk(
  "regions/create",
  async (data: CreateRegionData[], { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;

      console.log("Creating Regions:", data);

      const response = await axios.post(`${Url}/region`, data, {
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

export const createRegionSlice = createSlice({
  name: "create/region",
  initialState,
  reducers: {
    resetCreateRegion: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRegionFn.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(createRegionFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(createRegionFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetCreateRegion } = createRegionSlice.actions;
export default createRegionSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Region update input type
export interface UpdateRegionData {
  id: number; // region_id
  region_name?: string;
  description?: string;
}

const initialState = {
  data: null as any,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};

// Thunk for updating a region
export const updateRegionFn = createAsyncThunk(
  "region/update",
  async (data: UpdateRegionData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;

      const response = await axios.put(
        `${Url}/region/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

// Slice for update region
export const updateRegionSlice = createSlice({
  name: "update/region",
  initialState,
  reducers: {
    resetUpdateRegion: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateRegionFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(updateRegionFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(updateRegionFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetUpdateRegion } = updateRegionSlice.actions;

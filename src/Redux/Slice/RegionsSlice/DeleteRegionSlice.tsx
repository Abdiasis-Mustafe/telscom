import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Delete Region input type
export interface DeleteRegionData {
  id: number; // region_id
}

const initialState = {
  data: null as any,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};

// Thunk for deleting a region
export const deleteRegionFn = createAsyncThunk(
  "region/delete",
  async (data: DeleteRegionData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;

      const response = await axios.delete(`${Url}/region/${data.id}`, {
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

// Slice for deleting a region
export const deleteRegionSlice = createSlice({
  name: "delete/region",
  initialState,
  reducers: {
    resetDeleteRegion: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteRegionFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(deleteRegionFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(deleteRegionFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetDeleteRegion } = deleteRegionSlice.actions;

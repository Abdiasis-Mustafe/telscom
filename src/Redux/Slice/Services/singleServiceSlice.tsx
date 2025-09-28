import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

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

interface ServiceState {
  byId: Record<number, ServiceData>;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
}

const initialState: ServiceState = {
  byId: {},
  isLoading: false,
  isError: false,
  errorMsg: "",
};

export const SingleServiceFN = createAsyncThunk(
  "service/getOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      const res = await axios.get(`${Url}/Services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as ServiceData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetOneServiceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    resetOneService: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(SingleServiceFN.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMsg = "";
    });
    builder.addCase(SingleServiceFN.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.byId[action.payload.service_id] = action.payload;
    });
    builder.addCase(SingleServiceFN.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMsg = String(action.payload);
    });
  },
});

export const { resetOneService } = GetOneServiceSlice.actions;


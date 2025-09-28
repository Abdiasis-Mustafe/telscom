import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

// Service input type
export interface CreateServiceData {
  name: string;
  description: string;
  company_id?: string; 
}

const initialState = {
  data: [] as any[],
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: "",
};


export const createServiceFn = createAsyncThunk(
  "createService",
  async (data: CreateServiceData[], { rejectWithValue }) => {
    try {
      const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).user.company_id;
      const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      
      const servicesData = data.map((service) => ({
        ...service,
        company_id: Company_Id,
      }));

      console.log("Creating Services:", servicesData);

      
      const response = await axios.post(`${Url}/services`, servicesData,{headers: {
        Authorization: `Bearer ${token}`,
      },});

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

export const createServiceSlice = createSlice({
  name: "create/service",
  initialState,
  reducers: {
    resetService: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(createServiceFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(createServiceFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetService } = createServiceSlice.actions;
export default createServiceSlice.reducer;

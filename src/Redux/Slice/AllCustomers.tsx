import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

interface CustomerData {
  customer_id: number;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

interface CustomerState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMsg: string;
  data: CustomerData[];
}

const initialState: CustomerState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  data: [],
};

 const getAllCustomerFn = createAsyncThunk<CustomerData[]>(
  "AllCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;
      const res = await axios.get(`${Url}/customers?company_id=${company_Id}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response?.data.message || errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

 const GetAllCustomerSlice = createSlice({
  name: "getAllCustomer",
  initialState,
  reducers: {
    resetAllCustomer: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMsg = "";
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomerFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMsg = "";
      })
      .addCase(getAllCustomerFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.errorMsg = "";
        state.data = action.payload;
      })
      .addCase(getAllCustomerFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMsg = String(action.payload);
      });
  },
});

export const { resetAllCustomer } = GetAllCustomerSlice.actions;
export default GetAllCustomerSlice.reducer;

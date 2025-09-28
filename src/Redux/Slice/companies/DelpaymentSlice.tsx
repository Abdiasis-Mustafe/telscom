import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "../../../Interfaces";



const initialState={
    isLoading:false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    
};

export const delPaymentFn = createAsyncThunk(
    'Delete/user',
    async ({ id, company_id }: { id: number; company_id: string },   { rejectWithValue }) => {
      try {
        const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
        const res = await axios.delete(`${Url}/paid/${id}`,{
          headers: {
              Authorization: `Bearer ${token}`,
          },
          data: { company_id } 
        });
        return res.data.message;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data.message || errorMsg);
        }
  
        return rejectWithValue(errorMsg);
      }
    }
);

export const delPaymentSlice = createSlice({
    name: 'DelPayment',
    reducers: {
      resetDelPayment: () => initialState,
    },
    initialState,
    extraReducers(builder) {
      builder.addCase(delPaymentFn.pending, () => ({
        ...initialState,
        isLoading: true,
      }));
      builder.addCase(delPaymentFn.fulfilled, (_, action) => ({
        ...initialState,
        isSuccess: true,
        message: String(action.payload),
      }));
      builder.addCase(delPaymentFn.rejected, (_, action) => ({
        ...initialState,
        isError: true,
        errorMsg: String(action.payload),
      }));
    },
  });

  export const { resetDelPayment } = delPaymentSlice.actions
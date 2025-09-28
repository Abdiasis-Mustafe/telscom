import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "../../../Interfaces";



const initialState={
    isLoading:false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    
};

export const delCompnayFn = createAsyncThunk(
    'Delete/Vendor',
    async (id: number, { rejectWithValue }) => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')!).accessToken;
        const res = await axios.delete(`${Url}/companies/${id}`,{
          headers: {
              Authorization: `Bearer ${token}`,
          },
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

export const delCompanySlice = createSlice({
    name: 'DelVendor',
    reducers: {
      resetDelcompany: () => initialState,
    },
    initialState,
    extraReducers(builder) {
      builder.addCase(delCompnayFn.pending, () => ({
        ...initialState,
        isLoading: true,
      }));
      builder.addCase(delCompnayFn.fulfilled, (_, action) => ({
        ...initialState,
        isSuccess: true,
        message: String(action.payload),
      }));
      builder.addCase(delCompnayFn.rejected, (_, action) => ({
        ...initialState,
        isError: true,
        errorMsg: String(action.payload),
      }));
    },
  });

  export const { resetDelcompany } = delCompanySlice.actions
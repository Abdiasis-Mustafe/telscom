import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "../../Interfaces";



const initialState={
    isLoading:false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    
};

export const delProductFn = createAsyncThunk(
    'Delete/Product',
    async (id: number, { rejectWithValue }) => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo')!).accessToken;
        const res = await axios.delete(`${Url}/products/${id}`,{
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

export const delProductSlice = createSlice({
    name: 'DelProducts',
    reducers: {
      resetDelProducts: () => initialState,
    },
    initialState,
    extraReducers(builder) {
      builder.addCase(delProductFn.pending, () => ({
        ...initialState,
        isLoading: true,
      }));
      builder.addCase(delProductFn.fulfilled, (_, action) => ({
        ...initialState,
        isSuccess: true,
        message: String(action.payload),
      }));
      builder.addCase(delProductFn.rejected, (_, action) => ({
        ...initialState,
        isError: true,
        errorMsg: String(action.payload),
      }));
    },
  });

  export const { resetDelProducts } = delProductSlice.actions
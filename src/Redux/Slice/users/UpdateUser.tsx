import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Url, errorMsg } from "@/Interfaces";

export interface UpdateUserData {
    id:number,
    full_name: string,
    email: string,
    password: string,
    role:string,
   
}

const initialState = {
  data: null,
  IsSuccess: false,
  isLoading: false,
  isError: false,
  errorMsg: '',
};

export const UpdateMainUserFn = createAsyncThunk(
  'UpdateEmploye',
  async (data: UpdateUserData, { rejectWithValue }) => {
    try {
    //   const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).company_id;
      const id=data.id
      const employeeWithCompanyId = {
        ...data,
          // id: data.vendor_id
      };
      const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
      const response = await axios.put(`${Url}/Main/auth/${id}`, employeeWithCompanyId,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError)
        return rejectWithValue(error.response?.data.message || errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const UpdateMainuserSlice = createSlice({
  name: 'Updateuser',
  initialState,
  reducers: { resetMainUserUpdates: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(UpdateMainUserFn.pending, (state) => {
        state.isLoading = true;
        state.IsSuccess = false;
        state.isError = false;
        state.errorMsg = '';
      })
      .addCase(UpdateMainUserFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IsSuccess = true;
        state.data = action.payload;
      })
      .addCase(UpdateMainUserFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMsg = action.payload as string;
      });
  },
});

export const { resetMainUserUpdates } = UpdateMainuserSlice.actions;


import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";


export interface OneSalaryData{
    salary_id:number
    paid_amount:string
    date:string
    employee_id:number
    created_at:string
    updated_at:string
  
}






const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:{} as OneSalaryData,
};
export const getOneSalaryFn= createAsyncThunk(
    'getOneVendor',
    async(salary_id: number,{rejectWithValue})=>{
        try {
            // const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            // const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/salaries/${salary_id}`,{
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
              })

              return res.data
        } catch (error) {

            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
        
              return rejectWithValue(errorMsg); 
            
        }
    }
)

export const GetOneSalarySlice = createSlice({
    name:'getOnesalary',
    reducers:{
        resetOneSlary :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getOneSalaryFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getOneSalaryFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getOneSalaryFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetOneSlary} = GetOneSalarySlice.actions
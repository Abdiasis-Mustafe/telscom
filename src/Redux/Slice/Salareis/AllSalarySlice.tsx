import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";


export interface AllSalaryData{
    salary_id:number
    paid_amount:string
    date:string
    employee_id:number
    created_at:string
    updated_at:string
    employees:{
        employee_id:string
        employee_name:string
        employee_address:string
        employee_phone:string
        salary_amount:string
        company_id:string
        created_at:string
        updated_at:string
    }
}



const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:[] as AllSalaryData[],
};
export const getAllSalariesFn= createAsyncThunk(
    'getAllsalaries',
    async(_,{rejectWithValue})=>{
        try {
            const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            // const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/salaries?company_id=${compnay_Id}&page_number=1&page_size=10`,{
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

export const GetAllSalariesSlice = createSlice({
    name:'getallOrder',
    reducers:{
        resetAllSalaries :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getAllSalariesFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getAllSalariesFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getAllSalariesFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetAllSalaries} = GetAllSalariesSlice.actions
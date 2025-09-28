import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";

interface SalesInfo {
    total_sales: string;
    cash_sales: string;
    total_sales_cost: string;
  }
  interface SalaryExpenses {
    total_salaries_expenses: string;
  }
  interface OtherExpenses {
    total_other_expenses: string;
  }
    
  interface FinancialData {
    salesInfo: SalesInfo[];
    salaryExpenses: SalaryExpenses[];
    otherExpenses: OtherExpenses[];
  }
  

interface dataDate{
    startDate:string,
    endDate:string

}


const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:{} as FinancialData ,
};
export const GetAllIncomeReporFn= createAsyncThunk(
    'getAllexpenses',
    async(Data:dataDate,{rejectWithValue})=>{
        try {
            const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            // const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/reports/incomestatement?company_id=${compnay_Id}&start_date=${Data.startDate}&end_date=${Data.endDate}`,{
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

export const GetAllIncomeReportSlice = createSlice({
    name:'getallExpenses',
    reducers:{
        resteAllIncome :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(GetAllIncomeReporFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(GetAllIncomeReporFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(GetAllIncomeReporFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resteAllIncome} = GetAllIncomeReportSlice.actions
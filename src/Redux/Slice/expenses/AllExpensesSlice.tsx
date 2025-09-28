import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";


export interface AllExpensesData{
    expense_id:number
    item_name:string
    item_qty:number
    item_cost:string
    paid_amount:string
    date:string
    company_id:string
    created_at:string
    updated_at:string
    
}



const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:[] as AllExpensesData[],
};
export const getAllExpensesOnlyFn= createAsyncThunk(
    'getAllsalaries',
    async(_,{rejectWithValue})=>{
        try {
            const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            // const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/otherexpenses?company_id=${compnay_Id}`,{
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

export const GetAllExpensesOnlySlice = createSlice({
    name:'getallOrder',
    reducers:{
        resetAllExpenses :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getAllExpensesOnlyFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getAllExpensesOnlyFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getAllExpensesOnlyFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetAllExpenses} = GetAllExpensesOnlySlice.actions
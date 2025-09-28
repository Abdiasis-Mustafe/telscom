import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";



interface dataDate{
    startDate:string,
    endDate:string

}


const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:[],
};
export const getAllSaleFn= createAsyncThunk(
    'getAllSale',
    async(Data:dataDate,{rejectWithValue})=>{
        try {
            const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/reports/sales?company_id=${compnay_Id}&start_date=${Data.startDate}&end_date=${Data.endDate}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
              })

              return res.data
        } catch (error) {

            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
        
              return rejectWithValue(errorMsg); 
            
        }
    }
)

export const GetAllSaleSlice = createSlice({
    name:'getallSales',
    reducers:{
        resteAllSale :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getAllSaleFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getAllSaleFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getAllSaleFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resteAllSale} = GetAllSaleSlice.actions
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";

// interface CustomerDta{
//     customer_id:number
//     customer_name:string
//     customer_address:string
//     customer_phone:string
//     company_id:string
//     created_at:string
//     updated_at:string
// }




const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:[] ,
};
export const getAllComppaniesFn= createAsyncThunk(
    'AllCompanies',
    async(_,{rejectWithValue})=>{
        try {
            // const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/companies`,{
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

export const GetAllCompaniesSlice = createSlice({
    name:'getallCompanies',
    reducers:{
        resetAllCompanies :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getAllComppaniesFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getAllComppaniesFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getAllComppaniesFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetAllCompanies} = GetAllCompaniesSlice.actions
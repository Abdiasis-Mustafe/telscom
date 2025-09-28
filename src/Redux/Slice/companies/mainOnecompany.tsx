import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";




interface CompanyData{
    company_id: string,
    company_name:string,
    company_phone:string,
    company_address: string,
    company_email:string,
    subscribtion_fee: string,
    taxable: boolean,
    isBanned:boolean,
    tax_percentage: number,
    created_at: string,
    updated_at: string
}

const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:{} as CompanyData ,
};
export const MaingetOneCompanayFN= createAsyncThunk(
    'getOneCompany',
    async(id:string,{rejectWithValue})=>{
        try {
            // const company_id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/companies/${id}`,{
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

export const mainGetOneCompanySlice = createSlice({
    name:'getOneCompanay',
    reducers:{
        resetOneCompnayMain :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(MaingetOneCompanayFN.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(MaingetOneCompanayFN.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(MaingetOneCompanayFN.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetOneCompnayMain} = mainGetOneCompanySlice.actions


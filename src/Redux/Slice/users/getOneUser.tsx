import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";


interface OneEmploymentDta{
    id:string
    full_name: string,
    email: string,
    password: string,
    role:string,
    
    created_at:string;
    updated_at:string;
}





const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:{} as OneEmploymentDta,
};
export const getOneMainUserFn= createAsyncThunk(
    'getOneuiser',
    async(id: number,{rejectWithValue})=>{
        try {
            // const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/Main/auth/${id}`,{
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

export const GetOneUserSlice = createSlice({
    name:'getOneEmployees',
    reducers:{
        resetOneUser :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getOneMainUserFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getOneMainUserFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getOneMainUserFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetOneUser} = GetOneUserSlice.actions
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";


interface VendorData{
    vendor_id:number
    vendor_name:string
    vendor_address:string
    vendor_email:string
    vendor_phone:string
    company_id:string
    created_at:string
    updated_at:string
}



const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:[] as VendorData[],
};
export const getAllVendorsFn= createAsyncThunk(
    'getAllVendor',
    async(_,{rejectWithValue})=>{
        try {
            const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            // const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/vendors?company_id=${compnay_Id}`,{
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

export const GetAllVendorSlice = createSlice({
    name:'getallOrder',
    reducers:{
        resetAllVendor :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getAllVendorsFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getAllVendorsFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getAllVendorsFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetAllVendor} = GetAllVendorSlice.actions
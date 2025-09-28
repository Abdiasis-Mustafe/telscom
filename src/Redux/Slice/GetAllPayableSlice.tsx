import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";


interface PayAbleData{
        vendor_name: string,
        vendor_phone: number,
        vendor_address: string,
        product_code: string,
        product_name: string,
        purchase_id: number,
        purchase_qty: number,
        item_cost: string,
        paid_amount: string,
        purchase_discount: string,
        total_cost: string,
        total_paid_and_discount: string,
        debt: string,
        created_at:string
}




const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:[] as PayAbleData[],
};
export const getAllPayableFn= createAsyncThunk(
    'getAllPayable',
    async(_,{rejectWithValue})=>{
        try {
            const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            // const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/payables/products?company_id=${compnay_Id}`,{
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

export const GetAllPayableSlice = createSlice({
    name:'getallPayable',
    reducers:{
        resetAllPayable :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getAllPayableFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getAllPayableFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getAllPayableFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetAllPayable} = GetAllPayableSlice.actions
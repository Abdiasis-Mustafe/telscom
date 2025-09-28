import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios,{AxiosError} from "axios";
import { Url,errorMsg } from "@/Interfaces";


export interface OnepaymentData {
    id: number,
    company_id: string,
    expected_amount: string,
    amount_paid: string,
    payment_date: string,
    start_date: string,
    end_date: string,
    months_covered: number,
    created_at: string,
    updated_at: string,
    company: {
        company_id: string,
        company_name: string,
        company_address: string,
        company_phone: string,
        company_email: string,
        isBanned: boolean,
        subscribtion_fee: string,
        subscription_end_date: string,
        taxable: boolean,
        tax_percentage: number,
        debt: string,
        created_at: string,
        updated_at: string,
        created_by:null
    }
}





const initialState ={
    isLoading: false,
    isError:false,
    isSuccess:false,
    errorMsg:'',
    data:{} as OnepaymentData,
};
export const getOnePaymentFn= createAsyncThunk(
    'getOnpayment',
    async(id: number,{rejectWithValue})=>{
        try {
            // const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/paid/${id}`,{
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

export const GetOnepaymentSlice = createSlice({
    name:'getOnpayment',
    reducers:{
        resetOnePayment :()=> initialState
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getOnePaymentFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getOnePaymentFn.fulfilled,(_,action)=>({
            ...initialState,
            isSuccess:true,
            data:action.payload,

        }));
        builder.addCase(getOnePaymentFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetOnePayment} = GetOnepaymentSlice.actions
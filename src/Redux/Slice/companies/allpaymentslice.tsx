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

export interface AllpaymentData {
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
    data:[]  as AllpaymentData[] ,
    total: 0,
    page: 1,
    pageSize: 20,
};
export const getAllPaymentFn= createAsyncThunk(
    'AllPayment',
    async(params: { page: number; pageSize: number; search?: string },{rejectWithValue})=>{
        try {
            // const compnay_Id =JSON.parse(localStorage.getItem("userInfo")!).company_id
            const token= JSON.parse(localStorage.getItem("userInfo")!).accessToken;
            const res= await axios.get(`${Url}/paid/`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                   
                    page: params.page,
                    pageSize: params.pageSize,
                    search: params.search
                  }
              })

              return res.data
        } catch (error) {

            if (error instanceof AxiosError)
                return rejectWithValue(error.response?.data.message || errorMsg);
        
              return rejectWithValue(errorMsg); 
            
        }
    }
)

export const GetAllPaymentSlice = createSlice({
    name:'AllPayment',
    reducers:{
        resetAllCompaniesPayment :()=> initialState,
        setPage: (state, action) => {
            state.page = action.payload;
          }
    },
    initialState,
    extraReducers(builder){
        builder.addCase(getAllPaymentFn.pending,()=>({
            ...initialState,
            isLoading:true
        }));
        builder.addCase(getAllPaymentFn.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.data = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.pageSize = action.payload.pageSize;

        });
        builder.addCase(getAllPaymentFn.rejected,(_,action)=>({
            ...initialState,
            isError:true,
            errorMsg:String(action.payload),
        }));
    }
})

export  const { resetAllCompaniesPayment,setPage} = GetAllPaymentSlice.actions
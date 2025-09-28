import {createSlice} from '@reduxjs/toolkit'

const initialState= localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')!):{
   
    full_name:'',
    token:'',
}

const userInfoSlice = createSlice({
    // name
    name:'userInfo',
    reducers:{
        setUser:(state,action)=>{
            console.log(action);
            state.name=action.payload.name;
            state.username= action.payload.username;
            state.token= action.payload.token;

            localStorage.setItem('userInfo',JSON.stringify(state));
        },
        logout:(state)=>{
            localStorage.removeItem('userInfo');
            state.username='';
            state.name= '';
            state.token=''
        }
    },
    initialState
});
export default userInfoSlice;
export const { setUser, logout } = userInfoSlice.actions;
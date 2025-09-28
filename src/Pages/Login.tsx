

import { LoginFn, reset } from '@/Redux/Slice/LoginSlice'
import { setUser } from '@/Redux/Slice/userinfo'
import { AppDispatch, RootState } from '@/Redux/Store'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiUser } from 'react-icons/fi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {  useNavigate } from 'react-router-dom'


interface UserLoginData {
  user_id:number;
  full_name:string;
  company_id: string;
  email: string;
  type: { id: number; type: 'admin' | 'user' };
  accessToken: string;
  refreshToken: string;
  create_at:string;
  updated_at:string
}

function Login() {
  
   const toastId: string='login'

  const [email,setemail]=useState('')
  const [password,setPassword]=useState('')
  const dispatch = useDispatch<AppDispatch>()

  

  const LogingState= useSelector((state:RootState)=> state.LoginStore)
  const navigate = useNavigate();
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      email,
      password,
    }; 
    dispatch(LoginFn(data));
  };
 


  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      const loginTime = parsedUserInfo.loginTimestamp;
      const currentTime = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (currentTime - loginTime <= twentyFourHours) {
        // navigate('/Dashboard/Home');
      } else {
        localStorage.removeItem('userInfo');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (LogingState.Isloading) {
      toast.loading('sign In...', { id: toastId });
    }
    if (LogingState.isSuccess) {
      const loginData = LogingState.data;
      const userInfoWithTimestamp = {
        ...loginData,
        loginTimestamp: new Date().getTime(), // Add login timestamp
      };
      dispatch(setUser({ loginData: userInfoWithTimestamp }));
      localStorage.setItem('userInfo', JSON.stringify(userInfoWithTimestamp));
      toast.success('Success', { id: toastId });
      navigate('/Dashboard/Home');
    }
    if (LogingState.isError) {
      toast.error(LogingState.errorMsg, { id: toastId });
    }
    dispatch(reset());
  }, [LogingState.isError, LogingState.isSuccess]);


  return (
    <div className='flex justify-center items-center h-screen font-serif'>
    <form  onSubmit={submitHandler}  className='bg-white dark:text-black sm:px-10 px-6 lg:px-14 py-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.4)] w-full max-w-xl'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <img src="" alt="" className='w-[130px]' />
        <h1 className='font-semibold pt-5'>Login</h1>
        <p className='text-sm'><span className='text-orange-600'>Welcome back!</span>, please enter your credential</p>
      </div>
      <div className='py-8'>
        <div className='flex flex-col gap-4'>
          <label htmlFor="">Email</label>
          <div className='relative'>
            <input value={email} onChange={(e) => setemail(e.target.value)} type="text" placeholder='Enter your Email' className='rounded-[8px] p-2 bg-[#EDF2F6] w-full pl-8' />
            <FiUser className='absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400' />
          </div>
          <label htmlFor="">Password</label>
          <div className='relative'>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Enter your password' className='rounded-[8px] p-2 bg-[#EDF2F6] w-full pl-8' />
            <RiLockPasswordLine className='absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400' />
          </div>
          <button type='submit' className='rounded-[8px] p-2 my-4 shadow-[0_0_15px_rgba(35,173,241,0.5)] bg-gradient-to-r from-[#605bff] to-[#3a3799] w-full text-white'>Login</button>
          
        </div>
      </div>
    </form>
  </div>
  )
}

export default Login





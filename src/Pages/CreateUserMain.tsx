


import React from 'react'

import {  useNavigate } from 'react-router-dom'
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/Redux/Store'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast';


import SideParsm from '@/components/SideParsm'
import Nav from '@/components/Nav'
// import { getAllComppaniesFn } from '@/Redux/Slice/companies/allCompaniesSlice'
import { CreateMainuserFn, resetCreateMainuserState } from '@/Redux/Slice/users/CreatemainUserSlice';






function UserCreate() {
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
//   const [company_id, setCompanyId] = useState('');

  // const [company_id,setcompany_id]= useState('')
  const dispatch = useDispatch<AppDispatch>();
  // const [isAdmin, setIsAdmin] = useState(false);
  // const AllCompanyState = useSelector((state: RootState) => state.getAllcompaines);
  //   useEffect(() => {
  //       dispatch(getAllComppaniesFn());
  //     }, [dispatch]);

  // const companies = Array.isArray(AllCompanyState.data)
  // ? AllCompanyState.data.map((company: any) => ({
  //     id: company.company_id,
  //     ...company,
  //   }))
  // : [];

   
  const { isLoading, isError, isSuccess, errorMsg } = useSelector(
    (state: RootState) => state.createMaiuser
  );
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      full_name,
      email,
      password,
      role,
     
    }; 
    dispatch(CreateMainuserFn(data));
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('User UserCreateed', { id: 'registerToast' });
      navigate('/');
    }
  
    if (isError) {
      toast.error(errorMsg, { id: 'registerToast' });
      dispatch(resetCreateMainuserState());
    }
    dispatch(resetCreateMainuserState())
  }, [isSuccess, isError, errorMsg, isLoading]);

//   const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');


  // useEffect(() => {
  //   if (userInfo.type.type === 'admin') {
  //     setIsAdmin(true);
  //   } else {
  //     setIsAdmin(false);
  //   }
  // }, [userInfo]);

  return (
   
    <div className="min-h-screen ">
    <div className='p-3 flex justify-between'>
      <h1 className='lg:hidden'>
        <SideParsm />
      </h1>
      <div className="navhome p-0 flex w-full justify-end">
        <Nav />
      </div>
    </div>
    <div>
      <h1 className="font-semibold text-lg">Create user</h1>
      <form onSubmit={submitHandler} className="bg-white dark:text-black my-2 p-4 rounded-[8px] w-full flex flex-col">
        
       
          <div >
            <div className="formdiv flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col">
                  <label htmlFor="">Full name</label>
                  <input
                    type="text"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={full_name}
                onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={email}
                                onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Password</label>
                  <input
                    type="password"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={password}
                                onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                <label htmlFor="">Role</label>
            <div className="relative">
           <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-[8px] p-2 bg-[#EDF2F6] w-full pl-8"
            >
              <option value="">Select Role</option>
             
                <option value="admin">Admin</option>
                <option value="superAdmin">SuperAdmin</option>
              
                <option value="user">User</option>
         
            </select> 
                </div>
               
              </div>
              
            
            </div>
            </div>
          </div>
      
        <div className="div flex justify-end my-4">
          <button type='submit' className='bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[14%] text-white p-2'>create User</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default UserCreate
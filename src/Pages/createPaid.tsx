


import React from 'react'

import {  useNavigate } from 'react-router-dom'
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/Redux/Store'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast';


import SideParsm from '@/components/SideParsm'
import Nav from '@/components/Nav'
import { getAllComppaniesFn } from '@/Redux/Slice/companies/allCompaniesSlice'

import { createPaidFn, resetPayment } from '@/Redux/Slice/companies/CreatepaidSlice';
import { Link } from 'react-router-dom';






function CompnayPayment() {
  const [amount_paid, setAmount] = useState('');
  const [months_covered, setmonths_covered] = useState('');
  
  const [company_id, setCompanyId] = useState('');
//   const [company_id, setCompanyId] = useState('');

  // const [company_id,setcompany_id]= useState('')
  const dispatch = useDispatch<AppDispatch>();
  // const [isAdmin, setIsAdmin] = useState(false);
  const AllCompanyState = useSelector((state: RootState) => state.getAllcompaines);
      useEffect(() => {
          dispatch(getAllComppaniesFn());
        }, [dispatch]);
  
    const companies = Array.isArray(AllCompanyState.data)
    ? AllCompanyState.data.map((company: any) => ({
        id: company.company_id,
        ...company,
      }))
    : [];
   
  const { isLoading, isError, IsSuccess, errorMsg } = useSelector(
    (state: RootState) => state.Paycompany
  );
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
        amount_paid,
        months_covered:+months_covered,
        company_id
      
     
    }; 
    dispatch(createPaidFn(data));
  };

  useEffect(() => {
    if (IsSuccess) {
      toast.success('User CompnayPaymented', { id: 'registerToast' });
      navigate('/');
    }
  
    if (isError) {
      toast.error(errorMsg, { id: 'registerToast' });
      dispatch(resetPayment());
    }
    dispatch(resetPayment())
  }, [IsSuccess, isError, errorMsg, isLoading]);

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
      <div className=' flex justify-between'>
      <h1 className="font-semibold text-lg">Create payment</h1>
      <Link to={'All'} className=' bg-green-400 p-2 rounded-xl px-6'>All Payments</Link>
      </div>
      <form onSubmit={submitHandler} className="bg-white dark:text-black my-2 p-4 rounded-[8px] w-full flex flex-col">
        
       
          <div >
            <div className="formdiv flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col">
                  <label htmlFor="">Amount</label>
                  <input
                    type="text"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={amount_paid}
                onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Covered month</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={months_covered}
                                onChange={(e) => setmonths_covered(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col">
                <label htmlFor="">Company</label>
            <div className="relative">
            <select
                value={company_id}
                onChange={(e) => setCompanyId(e.target.value)}
                className="rounded-[8px] p-2 bg-[#EDF2F6] text-black w-full pl-8"
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
 
                </div>
               
              </div>
              
            
            </div>
            </div>
          </div>
      
        <div className="div flex justify-end my-4">
          <button type='submit' className='bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[14%] text-white p-2'>pay now</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default CompnayPayment
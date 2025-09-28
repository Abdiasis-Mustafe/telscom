


import React from 'react'

import {  useNavigate } from 'react-router-dom'
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/Redux/Store'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast';

import SideParsm from '@/components/SideParsm'
import Nav from '@/components/Nav'
import { createSalaryFn, resetSalary } from '@/Redux/Slice/Salareis/CreateSalarySlice';
import { getAllEmployersFn } from '@/Redux/Slice/Employe/AllEmloyers';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';






function CreateSalary() {
  const [paid_amount, setName] = useState('');
  const [date, setdate] = useState('');
  const [employee_id, setEmploye] = useState('');
  // const [company_id,setcompany_id]= useState('')
  const dispatch = useDispatch<AppDispatch>();
 
  // 
const Allemployees= useSelector((state:RootState)=>state.AllEmployes)
useEffect(() => {
  dispatch(getAllEmployersFn());
}, [dispatch]);
   
  const CreateSaleState = useSelector(
    (state: RootState) => state.CreateSalary
  );
  const navigate = useNavigate();

 
  const submitHandler =async(e:React.FormEvent)=>{

    e.preventDefault();
    const data= {
      paid_amount,
      date,
      employee_id:+employee_id
    }
    dispatch(createSalaryFn(data))
  }
  

  useEffect(() => {
    if (CreateSaleState.IsSuccess) {
      toast.success('Paid ', { id: 'salry' });
      navigate('/');
    }
  
    if (CreateSaleState.isError) {
      toast.error(CreateSaleState.errorMsg, { id: 'salry' });
      dispatch(resetSalary());
    }
    dispatch(resetSalary())
  }, [CreateSaleState.IsSuccess, CreateSaleState.isError,  CreateSaleState.isLoading]);

  // const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');


 
  return (
   
    <div className="min-h-screen ">
    <div className='p-3'>
      <h1 className='lg:hidden'>
        <SideParsm />
      </h1>
      <div className="navhome p-0 flex w-full justify-end">
        <Nav />
      </div>
    </div>
    <div>
      
      <form onSubmit={submitHandler} className="bg-white dark:text-black my-2 p-4 rounded-[8px] w-full flex flex-col">
      <Link to={'/Dashboard/Employees/salaries'}>
        <h1 className="text-3xl dark:text-black font-bold"><IoIosArrowRoundBack />
        </h1>
        </Link>
        
        <h1 className="font-semibold dark:text-black text-lg">Create Salary</h1>
          <div >
            <div className="formdiv flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col">
                  <label htmlFor="">Paid Amount</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={paid_amount}
                onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">date</label>
                  <input
                    type="date"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={date}
                                onChange={(e) => setdate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Employee</label>
                  <select  value={employee_id}
                      onChange={(e) => setEmploye(e.target.value)}
                      className="border border-gray-400 rounded-[10px] p-2">
                          <option>Select</option>
                        {Allemployees?.data?.map((employee) => (
                        <option key={employee.employee_id} value={employee.employee_id}>
                          {employee.employee_name}
                        </option>
                      ))}
                            
                      </select>
                </div>
               
            
            </div>
            </div>
          </div>
      
        <div className="div flex justify-end my-4">
          <button type='submit' className='bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[14%] text-white p-2'>create Salary</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default CreateSalary
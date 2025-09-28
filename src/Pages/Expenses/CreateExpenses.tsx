


import React from 'react'

import {  useNavigate } from 'react-router-dom'
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/Redux/Store'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast';

import SideParsm from '@/components/SideParsm'
import Nav from '@/components/Nav'
// import { createSalaryFn, resetSalary } from '@/Redux/Slice/Salareis/CreateSalarySlice';
// import { getAllEmployersFn } from '@/Redux/Slice/Employe/AllEmloyers';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { createExpensesFn } from '@/Redux/Slice/expenses/CreateExpensesSlice';
import { resetAllExpenses } from '@/Redux/Slice/expenses/AllExpensesSlice';






function CreateExpenses() {
    const [item_name, setName] = useState('');
    const [item_qty, setQty] = useState('');
    const [item_cost, setCost] = useState('');
  const [paid_amount, setAmount] = useState('');
  const [date, setdate] = useState('');
  // const [company_id] = useState('');
  // const [company_id,setcompany_id]= useState('')
  const dispatch = useDispatch<AppDispatch>();
 
  // 
// const Allemployees= useSelector((state:RootState)=>state.AllEmployes)
// useEffect(() => {
//   dispatch(getAllEmployersFn());
// }, [dispatch]);
   
  const CreateExpensesState = useSelector(
    (state: RootState) => state.CreateExpenses
  );
  const navigate = useNavigate();

 
  const submitHandler =async(e:React.FormEvent)=>{

    e.preventDefault();
    const data= {
        item_name,
        item_qty:+item_qty,
        item_cost,
      paid_amount,
      date,
    //   company_id,
    }
    dispatch(createExpensesFn(data))
  }
  

  useEffect(() => {
    if (CreateExpensesState.IsSuccess) {
      toast.success('Paid ', { id: 'salry' });
      navigate('/Dashboard/Products/Expenses');
    }
  
    if (CreateExpensesState.isError) {
      toast.error(CreateExpensesState.errorMsg, { id: 'salry' });
      dispatch(resetAllExpenses());
    }
    dispatch(resetAllExpenses())
  }, [CreateExpensesState.IsSuccess, CreateExpensesState.isError,  CreateExpensesState.isLoading]);

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
        
        <h1 className="font-semibold dark:text-black text-lg">Create Expenses</h1>
          <div >
            <div className="formdiv flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col">
                  <label htmlFor="">item name</label>
                  <input
                    type="text"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={item_name}
                onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Paid Amount</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={paid_amount}
                onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="">Quantity</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={item_qty}
                onChange={(e) => setQty(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">Item Cost</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={item_cost}
                onChange={(e) => setCost(e.target.value)}
                  />
                </div>
                {/* <div className="flex flex-col">
                  <label htmlFor="">Item Cost</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={item_cost}
                onChange={(e) => setCost(e.target.value)}
                  />
                </div> */}
                <div className="flex flex-col">
                  <label htmlFor="">date</label>
                  <input
                    type="date"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={date}
                                onChange={(e) => setdate(e.target.value)}
                  />
                </div>
               
               
            
            </div>
            </div>
          </div>
      
        <div className="div flex justify-end my-4">
          <button type='submit' className='bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[14%] min-w-[200px] text-white p-2'>create Expenses</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default CreateExpenses
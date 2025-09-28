import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/Redux/Store'
import { useSelector } from 'react-redux'



import { getOnePaymentFn } from '../Redux/Slice/companies/getOnepayment';
import { UpdatePaymentFn } from '@/Redux/Slice/companies/updatePaymentSlice';
import { Link } from 'react-router-dom';
import SideParsm from '@/components/SideParsm';
import Nav from '@/components/Nav';

function CompnayPaymentUpdated() {
  const [formData, setFormData] = useState({
    amount_paid: '',
    months_covered: 0,
    company_id: ''
  });
  
  const params = useParams();
  const id = params.id;
  
  const dispatch = useDispatch<AppDispatch>();
  const GetOnePaymentState = useSelector((state: RootState) => state.getOnpayment)
  // const AllCompanyState = useSelector((state: RootState) => state.GetOneCompanay);
  // const updateState = useSelector((state: RootState) => state.UpdatePayment);


  
  
  // const { isLoading, isError, IsSuccess, errorMsg } = useSelector(
  //   (state: RootState) => state.Paycompany
  // );
  const navigate = useNavigate();

  // Load payment data if editing
  useEffect(() => {
    if (id) {
      dispatch(getOnePaymentFn(+id));
    }
  }, [id, dispatch]);

  // Populate form when payment data loads
  useEffect(() => {
    if (GetOnePaymentState.data && id) {
      setFormData({
        amount_paid: GetOnePaymentState.data.amount_paid,
        months_covered: GetOnePaymentState.data.months_covered,
        company_id: GetOnePaymentState.data.company_id
      });
    }
  }, [GetOnePaymentState.data, id]);

  // Load companies
  // useEffect(() => {
  //   dispatch(getOneCompanayFN(GetOnePaymentState.data.company_id));
  // }, [dispatch]);

  // const companies = Array.isArray(AllCompanyState.data)
  // ? AllCompanyState.data.map((company: any) => ({
  //     id: company.company_id,
  //     ...company,
  //   }))
  // : [];

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      months_covered: +formData.months_covered,
      amount_paid: formData.amount_paid // Convert to number if API requires
    };

   
      // Update existing payment with correct data structure
      dispatch(UpdatePaymentFn({ 
        id: +id!,
        amount_paid: data.amount_paid,
        months_covered: data.months_covered,
        company_id: data.company_id
      }));

      navigate('/Dashboard/Payment');
   
  };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          <h1 className="font-semibold text-lg">
            {id ? 'Update Payment' : 'Create Payment'}
          </h1>
          <Link to={'All'} className='bg-green-400 p-2 rounded-xl px-6'>
            All Payments
          </Link>
        </div>
        
        <form onSubmit={submitHandler} className="bg-white dark:text-black my-2 p-4 rounded-[8px] w-full flex flex-col">
          <div className="formdiv flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col">
                <label htmlFor="amount_paid">Amount</label>
                <input
                  type="text"
                  name="amount_paid"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={formData.amount_paid}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="months_covered">Covered month</label>
                <input
                  type="number"
                  name="months_covered"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={formData.months_covered}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="company_id">Company</label>
                <select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleInputChange}
                  className="rounded-[8px] p-2 bg-[#EDF2F6] text-black w-full"
                  disabled // Disable changing company_id when updating
                >
                  <option value={GetOnePaymentState.data?.company?.company_id || ''}>
                    {GetOnePaymentState.data?.company?.company_name || 'Select Company'}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="div flex justify-end my-4">
            <button 
              type='submit' 
              className='bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[14%] text-white p-2'
             
            >
             Update 
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompnayPaymentUpdated
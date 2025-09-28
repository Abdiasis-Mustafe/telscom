import DataPaments from '@/components/allDataPayment';
import Nav from '@/components/Nav'
import SideParsm from '@/components/SideParsm'
// import { SheetCreateV } from '@/Pages/CreateVendor';

// import { TableContainer } from '@mui/material';
// import React from 'react'

import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';

function AllPayments() {
  return (
    <div className=' min-h-screen overflow-x-hidden'>
        <div className='p-3  flex items-center justify-between gap-2  '>

      <h1 className='lg:hidden '>

            <SideParsm  />
         </h1>
          <div className="navhome p-0 flex w-full justify-end">
           <Nav/>
               </div>
            </div>

            <div>
                <div className='flex justify-between items-center my-2'>
                    <h1 className='font-semibold'>Payments</h1>
                    <Link to="/Dashboard/Payment">
        <h1 className="text-xl mr-6">
          <IoArrowBack />
        </h1>
      </Link>
                   
                   
                </div>
               <div className=' bg-white rounded-xl overflow-x-hidden w-[98] m-auto max-w-[970px]'>

               <DataPaments />
               </div>


            </div>
    
    </div>
  )
}

export default AllPayments
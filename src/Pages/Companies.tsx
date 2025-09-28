import Nav from '@/components/Nav'
import SideParsm from '@/components/SideParsm'
// import { SheetCreateV } from '@/Pages/CreateVendor';
import DataGridDemo from '@/components/ui/Table';
import { useEffect } from 'react';
// import { TableContainer } from '@mui/material';
// import React from 'react'
import { GoPlus } from "react-icons/go";
import { Link,  useNavigate } from 'react-router-dom';

function Companies() {
  const navigate = useNavigate()
  // useEffect(()=>{
  //   if(!localStorage.getItem('userInfo')){
  //       navigate('/');
  //   }
  // },[])
  return (
    <div className=' min-h-screen overflow-x-hidden '>
        <div className='p-3  flex items-center justify-between gap-2  '>

      <h1 className='lg:hidden '>

            <SideParsm  />
         </h1>
          <div className="navhome p-0 flex w-full justify-end">
           <Nav/>
               </div>
            </div>

            <div className=''>
                <div className='flex justify-between items-center my-2'>
                    <h1 className='font-semibold'>Companies</h1>
                    <Link to={"CreateCompanies"}>
                    <button className='bg-white rounded-xl text-green-600  flex gap-1 p-2 items-center'><GoPlus /> Add New</button>
                    </Link>
                   
                   
                </div>
               <div className=' bg-white rounded-xl overflow-x-hidden max-w-[1010px] m-auto '>

               <DataGridDemo />
               </div>


            </div>
    
    </div>
  )
}

export default Companies
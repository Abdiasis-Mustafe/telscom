import Nav from '@/components/Nav'
import SideParsm from '@/components/SideParsm'

import { useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Payables() {
  const navigate= useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate('/'); // or any other path you want to navigate to
    }
  }, [navigate]);
  return (
    <div className='min-h-screen'>
        <div className='p-3 flex items-center   '>
        <h1 className='lg:hidden '>
          <SideParsm  />
        </h1>
        <div className="navhome p-0 flex w-full justify-end">
          <Nav/>
        </div>
      </div>
      <div>

      <div className='flex justify-between items-center my-2'>
                    <h1 className='font-semibold'>Payable</h1>
                    <Link to={"/Dashboard/payable"}>
                    
                    </Link>
                   
                   
                </div>
      <div className='bg-white rounded-xl max-w-[1200px]  '>
    
      </div>
      </div>

    </div>
  )
}

export default Payables
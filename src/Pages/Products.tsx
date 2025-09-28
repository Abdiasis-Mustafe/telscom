import Nav from '@/components/Nav'
import SideParsm from '@/components/SideParsm'


import { FaPlusCircle } from 'react-icons/fa'

import { MdSell, MdTableBar } from 'react-icons/md'
import { Link } from 'react-router-dom'

function Products() {
  return (
    <div className='min-h-screen'>
     <div className='p-3 flex items-center justify-between  '>

            <h1 className='lg:hidden '>
          
                <SideParsm  />
            </h1>
                <div className="navhome p-0 flex w-full justify-end">
                <Nav/>
                    </div>
                </div>
                <div className='flex justify-between w-[98%] m-auto items-center my-4'>
                    <h1>Products</h1>
                    <div className='flex items-center gap-4'>
                    <Link to={"Expenses"}>
                    <button className='bg-[#605BFF] rounded-xl text-white gap-2  text-sm  flex  p-2 items-center px-6 hover:shadow-lg shadow-[0_4px_13.5px_rgba(100,100,254,1)]'><MdTableBar /> Expenses</button>
                        </Link>

                        <Link to={"Create"}>
                    <button className='bg-white rounded-xl text-black gap-2  text-sm  flex  p-2 items-center px-6 hover:shadow-lg shadow-[0_4px_13.5px_rgba(100,100,254,1)]'><FaPlusCircle /> Add New</button>
                        </Link>
                        <Link to={"/Dashboard/Purchases"}>
                    <button className='bg-[#018CC8] gap-2  text-white rounded-xl flex items-center p-2 px-2 text-sm justify-center hover:shadow-lg shadow-[0_4px_13.5px_rgba(100,100,254,1)] '><MdSell />Purchase product</button>
                        </Link>
                    </div>
                </div>
                <div className='bg-white rounded-xl w-[98%]'>
                    
                </div>
    </div>
  )
}

export default Products
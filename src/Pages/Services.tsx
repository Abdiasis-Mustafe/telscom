



import Nav from '@/components/Nav'
import SideParsm from '@/components/SideParsm'
import ServiceData from '@/components/ui/ServiceData'
import { FaPlusCircle } from 'react-icons/fa'


import { Link } from 'react-router-dom'
// import ProductListData from '../../component/ui/employeeData'

function AllServices() {
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
                    <h1>All Services</h1>
                    <div className='flex items-center gap-4'>
                    

                        <Link to={"Create"}>
                         <button className='bg-white rounded-xl text-black gap-2  text-sm  flex  p-2 items-center px-6 hover:shadow-lg shadow-[0_4px_13.5px_rgba(100,100,254,1)]'><FaPlusCircle /> Add New</button>
                        </Link>
                      
                    </div>
                </div>
                <div className='bg-white rounded-xl  max-w-[980px]'>
                    <ServiceData/>
                </div>
    </div>
  )
}

export default AllServices
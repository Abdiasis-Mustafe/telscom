import Nav from "@/components/Nav"
import SideParsm from "@/components/SideParsm"

import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";

import SalariesData from "@/components/ui/SalareisDta";
import { IoIosArrowRoundBack } from "react-icons/io";





  
export function Allsalary() {



  return (
    <div className="h-screen">
   <div className="p-3 flex justify-between items-center">
        <h1 className="lg:hidden">
          <SideParsm />
        </h1>
        <div className="navhome p-0 flex w-full justify-end">
          <Nav />
        </div>
      </div>

      <div className="bg-white dark:text-black p-4 m-auto max-w-[1200px] rounded-2xl">
        <Link to={'/Dashboard/Employees'}>
        <h1 className="text-3xl dark:text-black font-bold"><IoIosArrowRoundBack />
        </h1>
        </Link>
        <div className="flex justify-between my-4" >

        <h1 className="text-xl dark:text-black font-bold">All Salaries</h1>
        <div className="flex justify-center items-center gap-3">
          {/* <Link to={"newSalry"}>
          <button className='bg-teal-700 rounded-xl text-white hover:bg-teal-900   flex gap-1 p-2 items-center justify-center' ><BsCashCoin />Salary</button>
          </Link> */}

          <Link to={'newSalry'}>
          <button className='bg-blue-300 rounded-xl text-white hover:bg-blue-400 flex gap-1 p-2 items-center'><GoPlus /> Add New</button>
          </Link>
        </div>
        </div>
        <div className=""><SalariesData/></div>
      </div>

    </div>
  )
}

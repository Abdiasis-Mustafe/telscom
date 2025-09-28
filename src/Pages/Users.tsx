import Nav from "@/components/Nav"
import SideParsm from "@/components/SideParsm"


import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";
// import { BsCashCoin } from "react-icons/bs";
import UserData from "./UserData";





  
function Allusers() {



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

      <div className="bg-white p-4 dark:text-black rounded-2xl">
        <div className="flex justify-between my-4" >

        <h1 className="text-xl font-bold">All Users</h1>
        <div className="flex justify-center items-center gap-3">
          {/* <Link to={"salaries"}>
          <button className='bg-teal-700 rounded-xl text-white hover:bg-teal-900   flex gap-1 p-2 items-center justify-center' ><BsCashCoin />Salary</button>
          </Link> */}

          <Link to={'create'}>
          <button className='bg-blue-300 rounded-xl text-white hover:bg-blue-400 flex gap-1 p-2 items-center'><GoPlus /> Add New</button>
          </Link>
        </div>
        </div>
        <div className="dark:text-black"><UserData/></div>
      </div>

    </div>
  )
}

export default Allusers
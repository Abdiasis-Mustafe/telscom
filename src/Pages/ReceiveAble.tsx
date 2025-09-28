import Nav from '@/components/Nav'
import SideParsm from '@/components/SideParsm'

// import RecieveTable from '@/components/ui/ReceiveAbleTble'


function RecieveAble() {
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
      <div className='my-4'><h1>RecieveAble list</h1></div>
      <div className='bg-white rounded-xl w-[98%] m-auto max-w-[1200px] '>
  
      </div>

    </div>
  )
}

export default RecieveAble
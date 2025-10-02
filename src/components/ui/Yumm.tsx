

import { IoPeopleSharp } from "react-icons/io5";
import { MdAnalytics } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoHardwareChipSharp } from "react-icons/io5";

import { TbLayoutDashboardFilled,  TbReportAnalytics } from "react-icons/tb";

export const links = [
    {
      title: 'Dashboard',
      links: [
        {
          name: 'Home',
          title:"Dashboarda",
          icon: <TbLayoutDashboardFilled />,
        },
      ],
    },
  
    {
     
      links: [
        {
          name: 'Customers' ,
          // icon: <AiOutlineShoppingCart />,
          icon:<MdAnalytics />
        },
        // {
        //   name: 'Products',
        //   icon: <AiOutlineProduct/>
        // },
        // {
        //   name:'SubCategory',
        //   icon : <MdCategory/>
        // },
        // {
        //   name:'Sales',
        //   icon: <FaSellsy />
        // },
        // {
        //   name: 'Purchases',
        //   icon: <MdOutlinePayment />,
        // },
        // {
        //   name: 'Receiveable',
        //   icon: <IoIosNotifications /> ,
        // },
        // {
        //     name: 'Payables',
        //     icon: <RiSecurePaymentLine />  ,
        //   },
         
          {
            name:"Employees",
            icon:<IoPeopleSharp />
         },
          {
            name:"Financial ",
            icon: <TbReportAnalytics />,
          },
           {
            name:'User',
            icon:<IoPeopleSharp />
          },
          {
            name:'Services',
            icon:<MdAnalytics />
          },
          {
            name:'Regions',
            icon:<FaLocationDot />
          },
          {
            name:'Technical',
            icon:<IoHardwareChipSharp />
          },
          
      ],
    },

   
  ];
  
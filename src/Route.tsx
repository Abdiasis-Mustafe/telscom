
import { Outlet, createBrowserRouter } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'

import Dashhome from './Pages/Dashhome'
import DhashRoute from './Pages/DhashRoute'
import Notfound from './Pages/Notfound'



import CreatePurchase from './Pages/CreatePurchase'
import { SAlesCreate } from './Pages/Sales'

import Payables from './Pages/Payables'

import TopSale from './Pages/TopSale'

import UpdateVendors from './Pages/UpdateCompany'

import RecieveAble from './Pages/ReceiveAble'


// import { CreateEmployees } from './Pages/Employee/createEmployee'
// import UpdateEmployee from './Pages/Employee/UpdateEmployee'
import CreateSalary from './Pages/Salary/createSalary'
import { Allsalary } from './Pages/Salary/AllSalreis'
import UpdateSalary from './Pages/Salary/UpdateSalary'
import { AllExpenses } from './Pages/Expenses/AllExpenses'
import CreateExpenses from './Pages/Expenses/CreateExpenses'
import UpdateExpenses from './Pages/Expenses/UpdateExpenses'
import Companies from './Pages/Companies'
import Allusers from './Pages/Users'
import UserCreate from './Pages/CreateUserMain'
import UpdateMainUser from './Pages/UpdateMainuser'
import CompnayPayment from './Pages/createPaid'
import AllPayments from './Pages/AllPayment'
import CompnayPaymentUpdated from './Pages/Updatepayment'
import SheetCreateSummary from './Pages/CreateCustomer'
import AllEmoloye from './Pages/Employee/AllEmoloye'
import AllServices from './Pages/Services'
import CreateService from './Pages/createService'
import CustomerDetailPage from './Pages/customerDetailed'
import UpdateCustomerReport from './Pages/UpdateService'
import CreateEmployee from './Pages/Employee/createEmployee'
import EmployeeReportPage from './Pages/Employee/DetailEmployee'
import UpdateEmployeeReport from './Pages/Employee/UpdateEmployee'







function Route() {
  return (
    <div>
     <div><Outlet/></div>

    </div>
  )
}

export default Route


export const router = createBrowserRouter([
    {
        path:'/',
        element:<Route/>,
        children:[
            {
                index:true,
                element:<Login/>
            },
           
            {
              path:'*',
              element:<Notfound/>
            }
            
           
        ]
    },
    {
      path:'Dashboard',
      element:<DhashRoute/>,
      children:[
        {
          index:true,
          element:<Dashhome/>
        },
        {
          path:"Home",
          element:<Dashhome/>
        },
        {
          path:"Payment",
          element:<CompnayPayment/>
        },
        {
          path:"Payment/All",
          element:<AllPayments/>
        },
        {
          path:"Payment/All/Update/:id",
          element:<CompnayPaymentUpdated/>
        },
        {
          path:'*',
          element:<Notfound/>
        },
        {
          path:"Customers",
          element:<Companies/>
        },
        {
          path:"Customers/Detail/:id",
          element:<CustomerDetailPage/>
        },
        {
          path:"Customers/update/:id",
          element:<UpdateCustomerReport/>
        },
        {

          path:"User",
          element:<Allusers/>
        },
        {

          path:"User/create",
          element:<UserCreate/>
        },
        {

          path:"User/Update/:id",
          element:<UpdateMainUser/>
        },
        {
          path:"Customers/CreateCompanies",
          element:<SheetCreateSummary/>
        },
        // {
        //   path:"Products",
        //   element:<Products/>
        // },
        {
          path:"Products/Expenses",
          element:<AllExpenses/>
        },
        {
          path:"Products/Expenses/Create",
          element:<CreateExpenses/>
        },
        {
          path:"Products/Expenses/Update/:expense_id",
          element:<UpdateExpenses/>
        },
        // {
        //   path:"Products/Create",
        //   element:<ProductCreate/>
        // },
        {
          path:"Purchases",
          element:<CreatePurchase/>
        },
        {
          path:"Sales",
          element:<SAlesCreate/>
        },
        // {
        //   path:"Sales/CreateCustomer",
        //   element:<CreateCustomer/>
        // },
        {
          path:"Payables",
          element:<Payables/>
        },
        // {
        //   path:"Payables/payment/:purchase_id",
        //   element:<Payment/>
        // },
        {
          path:"TopSales",
          element:<TopSale/>
        },
        // {
        //   path:"Reports",
        //   element:<Reports/>
        // },
        // {
        //   path:"Reports/SaleReport",
        //   element:<SaleReports/>
        // },
        // {
        //   path:"Reports/ExpensesReport",
        //   element:<ExpensesReport/>
        // },
        // {
        //   path:"Reports/PurchasesReport",
        //   element:<PurchaseReport/>
        // },
        // {
        //   path:"Reports/Income",
        //   element:<ProfitOr/>
        // },
       
        {
          path:"Companies/Update/:company_id",
          element:<UpdateVendors/>
        },
        // {
        //   path:"Products/Update/:product_id",
        //   element:<ProductUpdate/>
        // },
        {
          path:"Receiveable",
          element:<RecieveAble/>
        },
        // {
        //   path:"Receiveable/RecieveAblepayment/:sale_id",
        //   element:<ReceivePayment/>
        // },
        {
          path:"Employees",
          element:<AllEmoloye/>
        },
        {
          path:"Employees/update/:report_id",
          element:<UpdateEmployeeReport/>
        },
        {
         path:"Employees/Detail/:report_id",
          element:<EmployeeReportPage/> 
        },
        {
          path:"Employees/Create",
          element:<CreateEmployee/>
        },
        {
          path:"Services",
          element:<AllServices/>
        },
        {
          path:"Services/Create",
          element:<CreateService/>
        },


        // {
        //   path:"Employees/New",
        //   element:<CreateEmployees/>
        // },
        // {
        //   path:"Employees/update/:employee_id",
        //   element:<UpdateEmployee/>
        // },
        {
          path:"Employees/salaries",
          element:<Allsalary/>
        },
        {
          path:"Employees/salaries/newSalry",
          element:<CreateSalary/>
        },
        {
          path:"Employees/salaries/update/:employee_id",
          element:<UpdateSalary/>
        }

      ]
    }
])
import {configureStore} from'@reduxjs/toolkit'
import registerSlice from './Slice/RegisterSlice';
import userInfoSlice from './Slice/userinfo';
import { LoginSlice } from './Slice/LoginSlice';
import { GetAllVendorSlice } from './Slice/GetAllVendor';
import { GetAllProductSlice } from './Slice/getAllProductsSlice';
import { createVendorSlice } from './Slice/CreateVendorSlice';
import { createProductSlice } from './Slice/CreateProductSlice';
import { CreatePurchaseSlice } from './Slice/CreatePurchhaseSlice';
import  { createSaleSlice } from './Slice/CreateSaleSlice';
import { createCustomerSlice } from './Slice/CreateCustomerSlice';

import { GetAllPurchaseSlice } from './Slice/AllPurchases';


import { delVendorSlice } from './Slice/DeleteVendor';
import { delProductSlice } from './Slice/DeleteProductSlice';

import { GetAllPayableSlice } from './Slice/GetAllPayableSlice';

import { GetAllSaleSlice } from './Slice/GetAllSaleSlice';
import { GetAllExpensesSlice } from './Slice/ExpensesSlice';

import { GetAllIncomeReportSlice } from './Slice/Los/Porift';

import { GetAllEmployeesSlice,  } from './Slice/Employe/AllEmloyers';
import { createEmployeeReportSlice } from './Slice/Employe/CreateEmployesSlice';
import { delEmployeesSlice } from './Slice/Employe/DeleteEmployesSlice';


import { createSalarySlice } from './Slice/Salareis/CreateSalarySlice';
import { UpdateSalarySlice } from './Slice/Salareis/UpdateSalarySlice';
import { GetAllSalariesSlice } from './Slice/Salareis/AllSalarySlice';
import { delSalarySlice } from './Slice/Salareis/DeleteSalaryslice';
import { GetOneSalarySlice } from './Slice/Salareis/getoneSlary';
import { GetAllExpensesOnlySlice } from './Slice/expenses/AllExpensesSlice';
import { createExpensesSlice } from './Slice/expenses/CreateExpensesSlice';
import { delExpensesSlice } from './Slice/expenses/DeleteExpensesSlice';
import { UpdateExpensesSlice } from './Slice/expenses/UpdateExpensesSLice';
import { GetOneExpenseSlice } from './Slice/expenses/GetOneExpenses';
import { GetOneCompanySlice } from './Slice/GetOneCompanaySlice';
import { GetAllCompaniesSlice } from './Slice/companies/allCompaniesSlice';
import { createCompanySlice } from './Slice/companies/createCompaniesSlice';
import { delCompanySlice } from './Slice/companies/deleteCompanySlice';
import { mainGetOneCompanySlice } from './Slice/companies/mainOnecompany';
import { UpdateCompanySlice } from './Slice/companies/Updatecompany';

import { delUserSlice } from './Slice/users/DeleteUser';
import CreateMainUserSlice from './Slice/users/CreatemainUserSlice';
import { GetOneUserSlice } from './Slice/users/getOneUser';
import { UpdateMainuserSlice } from './Slice/users/UpdateUser';
import { createPaymentSlice } from './Slice/companies/CreatepaidSlice';
import { GetAllPaymentSlice } from './Slice/companies/allpaymentslice';
import { GetOnepaymentSlice } from './Slice/companies/getOnepayment';
import { UpdatepaymentSlice } from './Slice/companies/updatePaymentSlice';
import { delPaymentSlice } from './Slice/companies/DelpaymentSlice';
import { GetAllUserCompnaySLice } from './Slice/users/getAllSlice';
import { createServiceSlice } from './Slice/Services/CreateServiceSlice';
import { GetAllServicesSlice } from './Slice/Services/allServices';
import { createCustomerReportSlice } from './Slice/customerReportSlice/CreateSlice';
import { GetAllCustomerSlice } from './Slice/customerReportSlice/AllCustomerReports';
import { singleCustomerReportSlice } from './Slice/customerReportSlice/SingleCustomerReport';
import { GetOneServiceSlice } from './Slice/Services/singleServiceSlice';
import { updateCustomerReportSlice } from './Slice/Services/UpdateServiceSlice';
import { deleteCustomerReportSlice } from './Slice/customerReportSlice/DeleteCustomerSlice';
import { employeeReportSlice } from './Slice/Employe/OneEmplaymentSlice';
import { updateEmployeeReportSlice } from './Slice/Employe/UpdateEmployeeSlice';



export const store =configureStore({
reducer:{
    user:registerSlice.reducer,
    userInfo: userInfoSlice.reducer,
    LoginStore: LoginSlice.reducer,
    AllVendors:GetAllVendorSlice.reducer,
    AllProduct:GetAllProductSlice.reducer,
    CreateVendor:createVendorSlice.reducer,
    CreateProduct:createProductSlice.reducer,
    createPurchase:CreatePurchaseSlice.reducer,
    createSales:createSaleSlice.reducer,
    AllPurchase:GetAllPurchaseSlice.reducer,
    CreateCustomer:createCustomerSlice.reducer,
    AllCustomer:GetAllCustomerSlice.reducer,
  
   
    DelVendor:delVendorSlice.reducer,
    DelProducs:delProductSlice.reducer,
    
    AllPayable:GetAllPayableSlice.reducer,
   
    GetSale:GetAllSaleSlice.reducer,
    GetExpenses:GetAllExpensesSlice.reducer,
  
    GetIncome:GetAllIncomeReportSlice.reducer,
  


    AllEmployes:GetAllEmployeesSlice.reducer,
    CreateEmployee:createEmployeeReportSlice.reducer,
    deleteEmployee:delEmployeesSlice.reducer,
    UpdateEmployees:updateEmployeeReportSlice.reducer,
    employeeReport: employeeReportSlice.reducer,


    //salary
    CreateSalary:createSalarySlice.reducer,
    updateSalary:UpdateSalarySlice.reducer,
    AllSalaries:GetAllSalariesSlice.reducer,
    DeleteSalary:delSalarySlice.reducer,
    getOnesalary:GetOneSalarySlice.reducer,

    // expenses
    GetAllExpensesOnly:GetAllExpensesOnlySlice.reducer,
    CreateExpenses:createExpensesSlice.reducer,
    DelExpenses:delExpensesSlice.reducer,
    UpdateExpenses:UpdateExpensesSlice.reducer,
    OneExpense:GetOneExpenseSlice.reducer,

    //Companay
    GetOneCompanay:GetOneCompanySlice.reducer,
    getAllcompaines:GetAllCompaniesSlice.reducer,
    createCompany:createCompanySlice.reducer,
    DelCompany:delCompanySlice.reducer,
    OneMainCompany: mainGetOneCompanySlice.reducer,
    updateCompany:UpdateCompanySlice.reducer,


    /// users
     AllUsers: GetAllUserCompnaySLice.reducer,
     Deluser: delUserSlice.reducer,
     createMaiuser:CreateMainUserSlice.reducer,
     getOneMain:GetOneUserSlice.reducer,
     UpdateMainUser:UpdateMainuserSlice.reducer,


     //payment
     Paycompany:createPaymentSlice.reducer,
     AllPayment:GetAllPaymentSlice.reducer,
     getOnpayment:GetOnepaymentSlice.reducer,
     UpdatePayment:UpdatepaymentSlice.reducer,
     DelPayment:delPaymentSlice.reducer,


     //services
     CreateService:createServiceSlice.reducer,
     AllServices:GetAllServicesSlice.reducer,
     Oneservice:GetOneServiceSlice.reducer,
     


     //Customer Report
     CreateCustomerR:createCustomerReportSlice.reducer,
     GetAllCustomersR:GetAllCustomerSlice.reducer,
     SingleCustomerR:singleCustomerReportSlice.reducer,
     UpdateCustomerR:updateCustomerReportSlice.reducer,
     DeleteCustomerR:deleteCustomerReportSlice.reducer,




},
devTools:true
})
export type RootState = ReturnType<typeof store.getState>; //use Selector
export type AppDispatch =typeof store.dispatch;//useDispatch
import React, { FormEvent, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { GoPlus } from "react-icons/go";
import { CiImport, CiTrash } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import toast from 'react-hot-toast';
import { createSaleFn, resetSale } from '@/Redux/Slice/CreateSaleSlice';
import { getAllPurchasesFn } from '@/Redux/Slice/AllPurchases';
// import { getAllCustomerFn } from '@/Redux/Slice/AllCustomers';
import { getAllVendorsFn } from '@/Redux/Slice/GetAllVendor';

export function SAlesCreate() {
  const toastId = "saleid";
  const createSaleState = useSelector((state: RootState) => state.createSales);
  const AllCustomerState = useSelector((state: RootState) => state.AllCustomer);
  const AllPurchaseState = useSelector((state: RootState) => state.AllPurchase);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllVendorsFn());
    // dispatch(getAllCustomerFn());
    dispatch(getAllPurchasesFn());
  }, [dispatch]);

  useEffect(() => {
    if (createSaleState.isLoading) {
      toast.loading('Creating Sale...', { id: toastId });
    }
    if (createSaleState.IsSuccess) {
      toast.success('Successfully created.', { id: toastId });
      // navigate('/Dashboard/Receiveable');
      window.location.reload();
    }
    if (createSaleState.isError) {
      toast.error(createSaleState.errorMsg, { id: toastId });
    }
    dispatch(resetSale());
  }, [createSaleState.IsSuccess, createSaleState.isLoading, createSaleState.isError, dispatch, navigate]);

  type FormField = 'sale_qty' | 'item_price' | 'sale_discount' | 'received_amount' | 'purchase_id' | 'customer_id' | 'taxable_sale';

  interface FormInput {
    sale_qty: string;
    item_price: string;
    sale_discount: string;
    received_amount: string;
    purchase_id: string;
    customer_id: string;
    taxable_sale: boolean;
  }

  const [formInputs, setFormInputs] = useState<FormInput[]>([
    {
      sale_qty: '',
      item_price: '',
      sale_discount: '',
      received_amount: '',
      purchase_id: '',
      customer_id: '',
      taxable_sale: false,
    },
  ]);

  const handleAddNewInput = () => {
    setFormInputs([
      ...formInputs,
      {
        sale_qty: '',
        item_price: '',
        sale_discount: '',
        received_amount: '',
        purchase_id: '',
        customer_id: '',
        taxable_sale: false
      },
    ]);
  };

  const handleInputChange = (index: number, field: FormField, value: string | boolean) => {
    const updatedInputs: FormInput[] = [...formInputs];
    updatedInputs[index][field as keyof FormInput] = value as never; // Type assertion
    setFormInputs(updatedInputs);
  };

  const handleDelete = (index: number) => {
    const updatedInputs = [...formInputs];
    updatedInputs.splice(index, 1);
    setFormInputs(updatedInputs);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const formattedData = data.slice(1).map((row: any) => {
        const [sale_qty, item_price, sale_discount, received_amount, purchase_id, customer_id, taxable_sale] = row;
        return {
          sale_qty: sale_qty || '',
          item_price: item_price || '',
          sale_discount: sale_discount || '',
          received_amount: received_amount || '',
          purchase_id: purchase_id || '',
          customer_id: customer_id || '',
          taxable_sale: taxable_sale || ''
        };
      });

      setFormInputs(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (AllPurchaseState?.data) {
      const updatedInputs = formInputs.map(input => {
        const selectedPurchase = AllPurchaseState.data.find(purchase => purchase.purchase_id === +input.purchase_id);
        if (selectedPurchase) {
          return {
            ...input,
            item_price: selectedPurchase.products.product_price
          };
        }
        return input;
      });
      setFormInputs(updatedInputs);
    }
  }, [AllPurchaseState, formInputs]);

  const handlePurchaseChange = (index: number, purchase_id: string) => {
    const selectedPurchase = AllPurchaseState.data.find(purchase => purchase.purchase_id === +purchase_id);
    if (selectedPurchase) {
      handleInputChange(index, 'item_price', selectedPurchase.products.product_price);
    }
    handleInputChange(index, 'purchase_id', purchase_id);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = formInputs.map((input) => ({
      sale_qty: +input.sale_qty,
      item_price: input.item_price,
      sale_discount: input.sale_discount,
      received_amount: input.received_amount,
      purchase_id: +input.purchase_id,
      customer_id: +input.customer_id,
      taxable_sale: input.taxable_sale
    }));

    dispatch(createSaleFn(formData));
  };

  return (
    <div className="min-h-screen">
      <div className='p-3 flex items-center justify-between'>
        <h1 className='lg:hidden'>
          <SideParsm />
        </h1>
        <div className="navhome p-0 flex w-full justify-end">
          <Nav />
        </div>
      </div>
      <div className='text-black'>
        <div className='flex justify-between my-4 items-center'>
          <h1 className="font-semibold text-lg">Create Sale </h1>
          <Link to={"CreateCustomer"}>
            <button className='bg-[#4fa7fa] p-2 shadow-[0_4px_13.5px_rgba(96,91,255,1)] px-3 rounded-[8px] text-white flex justify-center items-center gap-2'>
              <span className='text-xl'><GoPlus /></span>Create Customer
            </button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white my-2 p-4 rounded-[8px] w-full flex flex-col">
          <div className="flex my-5 gap-2 justify-end px-4">
            <button type='button' className="bg-[#008CC8] px-2 gap-2 flex items-center text-white rounded-xl" onClick={() => document.getElementById('excel-import')!.click()}>
              <span className="text-xl"><CiImport /></span> Import Excel
            </button>
            <input
              id="excel-import"
              type="file"
              accept=".csv, .xlsx"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button type='button' className="p-2 flex gap-2 items-center" onClick={handleAddNewInput}>
              <span className="bg-[#E1E0FF] text-xl p-2 rounded-full"><GoPlus /></span>Add new
            </button>
          </div>
          {formInputs.map((input, index) => (
            <div key={index}>
              <form className="formdiv flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  <div className="flex flex-col ">
                    <label htmlFor="">Quantity</label>
                    <input
                      type="number"
                      className="border border-gray-400 rounded-[10px] p-2"
                      value={input.sale_qty}
                      onChange={(e) => handleInputChange(index, 'sale_qty', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="">Select purchase</label>
                    <select
                      value={input.purchase_id}
                      onChange={(e) => handlePurchaseChange(index, e.target.value)}
                      className="border border-gray-400 rounded-[10px] p-2">
                      <option>Select</option>
                      {AllPurchaseState?.data?.map((purchase) => (
                        <option key={purchase.purchase_id} value={purchase.purchase_id}>
                          <div className='flex gap-3 justify-around'>
                            <span>{purchase.purchase_id}</span>
                            {purchase.products.product_name}
                            <span> </span>
                            <span>Quantity {purchase.purchase_qty}</span>
                          </div>
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="">Item price</label>
                    <input
                      type="text"
                      className="border border-gray-400 rounded-[10px] p-2"
                      value={input.item_price}
                      onChange={(e) => handleInputChange(index, 'item_price', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="">Sales Discount</label>
                    <input
                      type="tel"
                      className="border border-gray-400 rounded-[10px] p-2"
                      value={input.sale_discount}
                      onChange={(e) => handleInputChange(index, 'sale_discount', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="">Received Amount</label>
                    <input
                      type="tel"
                      className="border border-gray-400 rounded-[10px] p-2"
                      value={input.received_amount}
                      onChange={(e) => handleInputChange(index, 'received_amount', e.target.value)}
                    />
                  </div>
                  {/* <div className="flex flex-col ">
                    <label htmlFor="">Customer</label>
                    <select required value={input.customer_id}
                      onChange={(e) => handleInputChange(index, 'customer_id', e.target.value)}
                      className="border border-gray-400 rounded-[10px] p-2">
                      <option>Select</option>
                      {AllCustomerState?.data?.map((customer) => (
                        <option key={customer.customer_id} value={customer.customer_id}>
                          {customer.customer_name}
                        </option>
                      ))}
                    </select>
                  </div> */}
                  
                  <div className="flex flex-col ">
                    <label htmlFor="">Tax</label>
                    <select
                      value={String(input.taxable_sale)} // Convert boolean to string
                      onChange={(e) => handleInputChange(index, 'taxable_sale', e.target.value === 'true')} // Convert string back to boolean
                      className="border border-gray-400 rounded-[10px] p-2">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 flex items-center gap-2 rounded-lg text-red-500" onClick={(e) => {
                    e.preventDefault();
                    handleDelete(index);
                  }}>
                    <CiTrash /> Delete
                  </button>
                </div>
              </form>
              {index !== formInputs.length - 1 && <hr />}
            </div>
          ))}
          <div className="div flex justify-end my-4">
            <button type='submit' className='bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] min-w-[200px] flex justify-center w-[14%] text-white p-2'>Create Sale</button>
          </div>
        </form>
      </div>
    </div>
  );
}


import { CreatePurchaseFn, createPurchasetData, resetPurchase } from '@/Redux/Slice/CreatePurchhaseSlice';
import { getAllVendorsFn } from '@/Redux/Slice/GetAllVendor';
import { getAllProductsFn } from '@/Redux/Slice/getAllProductsSlice';
import { AppDispatch, RootState } from '@/Redux/Store';
import Nav from '@/components/Nav';
import SideParsm from '@/components/SideParsm';
import  { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CreatePurchase() {
  const toastId = 'CreateVendor';    

  const [purchase_qty, setQuantity] = useState('');
  const [item_cost, setCost] = useState('');
  const [purchase_discount, setDiscount] = useState('');
  const [paid_amount, setPaid] = useState('');
  const [expiry_date, setExpire] = useState('');
  const [manufacture_date, setManufacture] = useState('');
  const [vendor_id, setVendor] = useState('');
  const [product_id, setProductId] = useState('');

  const AllProductsState = useSelector((state: RootState) => state.AllProduct);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllProductsFn());
  }, [dispatch]);

  const AllVendorState = useSelector((state: RootState) => state.AllVendors);
  
  useEffect(() => {
    dispatch(getAllVendorsFn());
  }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: createPurchasetData = {
      purchase_qty: +purchase_qty,
      item_cost,
      paid_amount,
      product_id: +product_id,
      purchase_discount,
      vendor_id: +vendor_id,
      manufacture_date,
      expiry_date,
    };
    console.log("Data before dispatch:", data);
    dispatch(CreatePurchaseFn(data));
  };

  const createPurchaseState = useSelector((state: RootState) => state.createPurchase);

  const navigate = useNavigate();
  useEffect(() => {
    if (createPurchaseState.isLoading) toast.loading('Saving...', { id: toastId });
    if (createPurchaseState.isSuccess) {
      toast.success('Successfully created', { id: toastId });
      // navigate('/Dashboard/products');
    }
    if (createPurchaseState.isError) {
      toast.error(createPurchaseState.errorMsg, { id: toastId });
    }
    dispatch(resetPurchase());
  }, [createPurchaseState.isLoading, createPurchaseState.isSuccess, createPurchaseState.isError]);
  
  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate('/'); // or any other path you want to navigate to
    }
  }, [navigate]);

  return (
    <div className='min-h-screen'>
      <div className='p-3 flex items-center justify-between '>
        <h1 className='lg:hidden'>
          <SideParsm />
        </h1>
        <div className="navhome p-0 flex w-full justify-end">
          <Nav />
        </div>
      </div>

      <h1 className='font-semibold w-[90%] m-auto mt-5'>Purchase product</h1>
      <div className='bg-white text-black rounded-[8px] w-[90%] m-auto'>
        <form onSubmit={handleSubmit} className='p-8 w-[80%] m-auto flex flex-col'>
          <div className='flex flex-col justify-center'>
            <label htmlFor="product">Select Product</label>
            <select
              id="product"
              value={product_id}
              onChange={(e) => setProductId(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] text-gray-400 my-2"
            >
              <option >Select Products</option>
              {AllProductsState?.data?.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col justify-center'>
            <label htmlFor="vendor">Select Vendor</label>
            <select
              id="vendor"
              value={vendor_id}
              onChange={(e) => setVendor(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] text-gray-400 my-2"
            >
               <option >Select Vendor</option>
              {AllVendorState?.data?.map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.vendor_name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col justify-center'>
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={purchase_qty}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] my-2"
              placeholder='Enter quantity here.'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label htmlFor="cost">Cost</label>
            <input
              type="number"
              id="cost"
              value={item_cost}
              onChange={(e) => setCost(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] my-2"
              placeholder='Enter cost here.'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label htmlFor="discount">Discount</label>
            <input
              type="number"
              id="discount"
              value={purchase_discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] my-2"
              placeholder='Enter discount here.'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label htmlFor="paid">Paid</label>
            <input
              type="number"
              id="paid"
              value={paid_amount}
              onChange={(e) => setPaid(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] my-2"
              placeholder='Enter amount here.'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label htmlFor="manufacture_date">Manufactured date</label>
            <input
              type="date"
              id="manufacture_date"
              value={manufacture_date}
              onChange={(e) => setManufacture(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] my-2"
              placeholder='Enter manufactured date here.'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label htmlFor="expiry_date">Expire date</label>
            <input
              type="date"
              id="expiry_date"
              value={expiry_date}
              onChange={(e) => setExpire(e.target.value)}
              className="bg-[#F7F7F8] p-2 rounded-[8px] my-2"
              placeholder='Enter expire date here.'
            />
          </div>
          <button type='submit' className='p-2 px-4 my-4 max-w-[480px] m-auto bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center items-center text-white'>
            Create purchase
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePurchase;

import  { FormEvent, useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import SideParsm from '@/components/SideParsm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { AppDispatch, RootState } from '@/Redux/Store';
import { resetCompanyUpdate, UpdateCompaniesFn } from '@/Redux/Slice/companies/Updatecompany';
import { MaingetOneCompanayFN } from '@/Redux/Slice/companies/mainOnecompany';

function UpdateCompany() {
  const toastId = "update";
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { company_id } = useParams<{ company_id: string }>(); 
  



  const OneCompanyState = useSelector((state: RootState) => state.OneMainCompany);
  const UpdateCompanyState = useSelector((state: RootState) => state.updateCompany);

  // Individual state variables for better control
  const [company_name, setCompanyName] = useState('');
  const [company_address, setCompanyAddress] = useState('');
  const [company_phone, setCompanyPhone] = useState('');
  const [company_email, setCompanyEmail] = useState('');
  const [subscribtion_fee, setSubscriptionFee] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [banned, setBanned] = useState<boolean>(false);
  const [tax_percentage, setTaxPercentage] = useState(5);

  // Fetch company details when ID changes
  useEffect(() => {
    if (company_id) {
      dispatch(MaingetOneCompanayFN(company_id));
    }
  }, [company_id, dispatch]);

  // Populate form with existing data
  useEffect(() => {
    if (OneCompanyState.data) {
      setCompanyName(OneCompanyState.data.company_name || '');
      setCompanyAddress(OneCompanyState.data.company_address || '');
      setCompanyPhone(OneCompanyState.data.company_phone || '');
      setCompanyEmail(OneCompanyState.data.company_email || '');
      setSubscriptionFee(OneCompanyState.data.subscribtion_fee?.toString() || '');
      setTaxable(OneCompanyState.data.taxable || false);
      setBanned(OneCompanyState.data.isBanned ?? false);
      setTaxPercentage(OneCompanyState.data.tax_percentage || 5);
    }
  }, [OneCompanyState.data]);

  // Handle update status messages
  useEffect(() => {
    if (UpdateCompanyState.isLoading) {
      toast.loading('Updating company...', { id: toastId });
    }
    if (UpdateCompanyState.IsSuccess) {
      toast.success('Successfully updated.', { id: toastId });
      navigate('/Dashboard/Companies');
    }
    if (UpdateCompanyState.isError) {
      toast.error(UpdateCompanyState.errorMsg, { id: toastId });
    }
    dispatch(resetCompanyUpdate());
  }, [UpdateCompanyState, dispatch, navigate]);

  // Form submission handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!company_id) return;

    const updatedData = {
      company_name,
      company_address,
      company_phone,
      company_email,
      subscribtion_fee: Number(subscribtion_fee),
      taxable,
      tax_percentage: Number(tax_percentage),
      isBanned: banned,
    };

    dispatch(UpdateCompaniesFn({ ...updatedData, company_id }));

  };

  return (
    <div className="min-h-screen text-black dark:text-white">
      <div className="p-3 flex items-center justify-between">
        <h1 className="lg:hidden">
          <SideParsm />
        </h1>
        <div className="navhome p-0 flex w-full justify-end">
          <Nav />
        </div>
      </div>
      <div>
        <h1 className="font-semibold text-lg dark:text-white">Update Company</h1>
        <form onSubmit={handleSubmit} className="bg-white text-black my-2 p-4 rounded-[8px] w-full flex flex-col">
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col">
              <label htmlFor="company_name">Company Name</label>
              <input
                type="text"
                className="border border-gray-400 rounded-[10px] p-2"
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="company_email">Company Email</label>
              <input
                type="email"
                className="border border-gray-400 rounded-[10px] p-2"
                value={company_email}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="company_address">Company Address</label>
              <input
                type="text"
                className="border border-gray-400 rounded-[10px] p-2"
                value={company_address}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="company_phone">Company Phone</label>
              <input
                type="text"
                className="border border-gray-400 rounded-[10px] p-2"
                value={company_phone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="subscribtion_fee">Subscription Fee</label>
              <input
                type="number"
                className="border border-gray-400 rounded-[10px] p-2"
                value={subscribtion_fee}
                onChange={(e) => setSubscriptionFee(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="taxable">Taxable</label>
              <select
                className="rounded-[8px] p-2 bg-[#EDF2F6] w-full pl-8"
                value={taxable.toString()}
                onChange={(e) => setTaxable(e.target.value === "true")}
              >
                <option value="">Select Tax Status</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="tax_percentage">Tax Percentage</label>
              <input
                type="number"
                className="border border-gray-400 rounded-[10px] p-2"
                value={tax_percentage}
                onChange={(e) => setTaxPercentage(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="taxable">Banned</label>
              <select
                className="rounded-[8px] p-2 bg-[#EDF2F6] w-full pl-8"
                value={banned.toString()} // Convert boolean to string for select
                onChange={(e) => setBanned(e.target.value === "true")}
              >
                <option value="">Select ban Status</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end my-4">
            <button type="submit" className="bg-[#605BFF] rounded-[8px] shadow-lg flex justify-center w-[14%] text-white p-2">
              Update Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCompany;

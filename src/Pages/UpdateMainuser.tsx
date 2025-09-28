import { getOneMainUserFn } from '@/Redux/Slice/users/getOneUser';

import { AppDispatch, RootState } from '@/Redux/Store';
import Nav from '@/components/Nav';
import SideParsm from '@/components/SideParsm';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { resetMainUserUpdates, UpdateMainUserFn } from '@/Redux/Slice/users/UpdateUser';

function UpdateMainUser() {
  const toastId = "update";
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const OneUsermainState = useSelector((state: RootState) => state.getOneMain);
  const UpdateMainUserState = useSelector((state: RootState) => state.UpdateMainUser);

  const params = useParams();
  const id = params.id;

  const [Mainuser, setMainuser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: '',
    id: id ? Number(id) : 0,
  });

  useEffect(() => {
    if (id) {
      dispatch(getOneMainUserFn(+id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (OneUsermainState.data) {
      setMainuser({
        full_name: OneUsermainState.data.full_name || '',
        email: OneUsermainState.data.email || '',
        password: '', // Keep it empty for security reasons
        role: OneUsermainState.data.role || '',
        id: OneUsermainState.data.id ? Number(OneUsermainState.data.id) : 0
      });
    }
  }, [OneUsermainState.data]);

  useEffect(() => {
    if (UpdateMainUserState.isLoading) {
      toast.loading('Updating ...', { id: toastId });
    }
    if (UpdateMainUserState.IsSuccess) {
      toast.success('Successfully updated.', { id: toastId });
      navigate('/Dashboard/User');
    }
    if (UpdateMainUserState.isError) {
      toast.error(UpdateMainUserState.errorMsg, { id: toastId });
    }
    if (UpdateMainUserState.isLoading || UpdateMainUserState.IsSuccess || UpdateMainUserState.isError) {
      dispatch(resetMainUserUpdates
        ());
    }
  }, [UpdateMainUserState.isLoading, UpdateMainUserState.IsSuccess, UpdateMainUserState.isError, dispatch, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMainuser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(UpdateMainUserFn(Mainuser));
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
      <div className="py-20">
        <h1 className="font-semibold text-lg dark:text-white">Update Employee</h1>
        <form onSubmit={handleSubmit} className="bg-white text-black my-2 p-4 rounded-[8px] w-full flex flex-col">
          <div className="formdiv py-20 flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col">
                <label htmlFor="full_name">Employee Name</label>
                <input
                  type="text"
                  name="full_name"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={Mainuser.full_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Employee Email</label>
                <input
                  type="text"
                  name="email"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={Mainuser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">New Password (Optional)</label>
                <input
                  type="password"
                  name="password"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={Mainuser.password}
                  onChange={handleInputChange}
                />
              </div>
                  
            </div>
          </div>
          <div className="flex justify-end my-4">
            <button type="submit" className="bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[14%] text-white p-2">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateMainUser;

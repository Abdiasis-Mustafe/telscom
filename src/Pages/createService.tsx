import  { FormEvent, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { GoPlus } from "react-icons/go";
import { CiTrash } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
// import { createServiceFn, resetService } from "@/Redux/Slice/CreateServiceSlice";
import toast from "react-hot-toast";
import { createServiceFn, resetService } from "@/Redux/Slice/Services/CreateServiceSlice";

function CreateService() {
  const toastId = "serviceToast";
  const dispatch = useDispatch<AppDispatch>();
  const createServiceState = useSelector((state: RootState) => state.CreateService);

  // local form state
  const [services, setServices] = useState([{ name: "", description: "" }]);

  // Add new service input row
  const handleAddNewInput = () => {
    setServices([...services, { name: "", description: "" }]);
  };

  // Delete service row
  const handleDelete = (index: number) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  // Change input values
  const handleInputChange = (index: number, field: "name" | "description", value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  // Submit form
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  try {
    const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).user.company_id;

    const servicesWithCompany = services.map((s) => ({
      ...s,
      company_id: Company_Id,
    }));

    dispatch(createServiceFn(servicesWithCompany));
  } catch (error) {
    console.error("Company_Id not found in localStorage", error);
    toast.error("User info not found. Please log in again.");
  }
};


  // Toasts for async state
  useEffect(() => {
    if (createServiceState.isLoading) {
      toast.loading("Creating services...", { id: toastId });
    }
    if (createServiceState.IsSuccess) {
      toast.success("Services created successfully.", { id: toastId });
      setServices([{ name: "", description: "" }]); // reset form
    }
    if (createServiceState.isError) {
      toast.error(createServiceState.errorMsg, { id: toastId });
    }
    dispatch(resetService());
  }, [createServiceState.isLoading, createServiceState.IsSuccess, createServiceState.isError, dispatch]);

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="p-3 flex justify-between items-center">
        <h1 className="lg:hidden">
          <SideParsm />
        </h1>
        <div className="navhome p-0 flex w-full justify-end">
          <Nav />
        </div>
      </div>

      <h1 className="font-semibold text-lg">Create Services</h1>
      <form onSubmit={handleSubmit} className="bg-white my-2 p-4 rounded-[8px] w-full flex flex-col">
        {/* Add Button */}
        <div className="flex gap-2 justify-end px-4 mb-4">
          <button type="button" className="p-2 flex gap-2 items-center" onClick={handleAddNewInput}>
            <span className="bg-[#E1E0FF] text-xl p-2 rounded-full">
              <GoPlus />
            </span>
            Add Service
          </button>
        </div>

        {/* Service Input Fields */}
        {services.map((service, index) => (
          <div key={index} className="border rounded p-3 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label>Service Name</label>
                <input
                  type="text"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={service.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  placeholder="Enter service name"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label>Service Description</label>
                <input
                  type="text"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={service.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  placeholder="Enter service description"
                  required
                />
              </div>
            </div>

            {/* Delete Button */}
            {services.length > 1 && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="px-4 py-2 flex items-center gap-2 rounded-lg text-red-500"
                  onClick={() => handleDelete(index)}
                >
                  <CiTrash /> Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Submit */}
        <div className="flex justify-end my-4">
          <button
            type="submit"
            className="bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[30%] text-white p-2"
          >
            Save Services
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateService;

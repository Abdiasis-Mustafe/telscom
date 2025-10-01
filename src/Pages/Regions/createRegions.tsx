import { FormEvent, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { GoPlus } from "react-icons/go";
import { CiTrash } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import toast from "react-hot-toast";
import { createRegionFn, resetCreateRegion } from "@/Redux/Slice/RegionsSlice/CreateRegionSlice";


function CreateRegion() {
  const toastId = "regionToast";
  const dispatch = useDispatch<AppDispatch>();
  const createRegionState = useSelector((state: RootState) => state.CreateRegion);

  // Local form state
  const [regions, setRegions] = useState([{ region_name: "" }]);

  // Add new region input row
  const handleAddNewInput = () => {
    setRegions([...regions, { region_name: "" }]);
  };

  // Delete region row
  const handleDelete = (index: number) => {
    const updated = [...regions];
    updated.splice(index, 1);
    setRegions(updated);
  };

  // Change input values
  const handleInputChange = (index: number, value: string) => {
    const updated = [...regions];
    updated[index] = { region_name: value };
    setRegions(updated);
  };

  // Submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(createRegionFn(regions));
  };

  // Toasts for async state
  useEffect(() => {
    if (createRegionState.isLoading) {
      toast.loading("Creating regions...", { id: toastId });
    }
    if (createRegionState.isSuccess) {
      toast.success("Regions created successfully.", { id: toastId });
      setRegions([{ region_name: "" }]); // reset form
    }
    if (createRegionState.isError) {
      toast.error(createRegionState.errorMsg, { id: toastId });
    }
    dispatch(resetCreateRegion());
  }, [createRegionState.isLoading, createRegionState.isSuccess, createRegionState.isError, dispatch]);

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

      <h1 className="font-semibold text-lg">Create Regions</h1>
      <form onSubmit={handleSubmit} className="bg-white my-2 p-4 rounded-[8px] w-full flex flex-col">
        {/* Add Button */}
        <div className="flex gap-2 justify-end px-4 mb-4">
          <button type="button" className="p-2 flex gap-2 items-center" onClick={handleAddNewInput}>
            <span className="bg-[#E1E0FF] text-xl p-2 rounded-full">
              <GoPlus />
            </span>
            Add Region
          </button>
        </div>

        {/* Region Input Fields */}
        {regions.map((region, index) => (
          <div key={index} className="border rounded p-3 mb-3">
            <div className="flex flex-col">
              <label>Region Name</label>
              <input
                type="text"
                className="border border-gray-400 rounded-[10px] p-2"
                value={region.region_name}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Enter region name"
                required
              />
            </div>

            {/* Delete Button */}
            {regions.length > 1 && (
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
            Save Regions
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRegion;

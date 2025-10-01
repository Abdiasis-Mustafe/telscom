import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/Redux/Store";

import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { getSingleRegionFn } from "@/Redux/Slice/RegionsSlice/SingleRegionsSlice";
import { resetUpdateRegion, updateRegionFn } from "@/Redux/Slice/RegionsSlice/UpdateRegion";

function UpdateRegion() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const SingleRegionState = useSelector((state: RootState) => state.SingleRegions);
  const updateState = useSelector((state: RootState) => state.UpdateRegion);

  const [regionName, setRegionName] = useState("");
  const toastId = "updateRegionToast";

  // Fetch single region
  useEffect(() => {
    if (id) dispatch(getSingleRegionFn(Number(id)));
    return () => {
      dispatch(resetUpdateRegion());
    };
  }, [id, dispatch]);

  // Prefill state when data arrives
  useEffect(() => {
    if (id && SingleRegionState.byId[Number(id)]) {
      setRegionName(SingleRegionState.byId[Number(id)].region_name);
    }
  }, [SingleRegionState.byId, id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!regionName || !id) return;

    dispatch(
      updateRegionFn({
        id: Number(id),
        region_name: regionName,
      })
    );
  };

  // Handle toast updates
  useEffect(() => {
    if (updateState.isLoading) {
      toast.loading("Updating region...", { id: toastId });
    } else if (updateState.IsSuccess) {
      toast.success("Region updated successfully!", { id: toastId });
      navigate("/dashboard/regions"); // redirect back to regions list
    } else if (updateState.isError) {
      toast.error(updateState.errorMsg, { id: toastId });
    }
    dispatch(resetUpdateRegion());
  }, [updateState, dispatch, navigate]);

  if (SingleRegionState.isLoading || !regionName) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="min-h-screen">
      <div className="p-3 flex justify-between items-center">
        <h1 className="lg:hidden"><SideParsm /></h1>
        <div className="navhome p-0 flex w-full justify-end"><Nav /></div>
      </div>

      <h1 className="font-semibold text-lg mb-4">Update Region</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg w-full max-w-md mx-auto">
        <div className="flex flex-col mb-4">
          <label>Region Name</label>
          <input
            type="text"
            value={regionName}
            className="border border-gray-400 rounded p-2"
            onChange={(e) => setRegionName(e.target.value)}
            placeholder="Enter region name"
            required
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-[#605BFF] rounded shadow-md px-6 py-2 text-white"
          >
            Update Region
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateRegion;

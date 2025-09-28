// import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { getSingleEmployeeReport } from "@/Redux/Slice/Employe/OneEmplaymentSlice";
import { FormEvent, useEffect, useState } from "react";
import { resetUpdateEmployeeReport, updateEmployeeReportFn } from "@/Redux/Slice/Employe/UpdateEmployeeSlice";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";

function UpdateEmployeeReport() {
  const { report_id } = useParams<{ report_id: string }>();
  const reportId = Number(report_id);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

 const { byId, isLoading, isError, errorMsg } = useSelector(
     (state: RootState) => state.employeeReport 
   );
  const updateState = useSelector((state: RootState) => state.UpdateEmployees);

  const report = byId[reportId];

  const [formData, setFormData] = useState({
    month: "",
    year: "",
    new_employees: 0,
    left_employees: 0,
    death: 0,
    serious_illness: 0,
    avg_performance: 0,
    company_id: "",
  });

  // Load report data when mounted
  useEffect(() => {
    if (reportId) dispatch(getSingleEmployeeReport(reportId));
  }, [dispatch, reportId]);

  useEffect(() => {
    if (report) {
      setFormData({
        month: String(report.month),
        year: String(report.year),
        new_employees: report.new_employees,
        left_employees: report.left_employees,
        death: report.death,
        serious_illness: report.serious_illness,
        avg_performance: Number(report.avg_performance) || 0,
        company_id: report.company_id || "",
      });
    }
  }, [report]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      report_id: reportId,
      ...formData,
      month: Number(formData.month),
      year: Number(formData.year),
      new_employees: Number(formData.new_employees),
      left_employees: Number(formData.left_employees),
      death: Number(formData.death),
      serious_illness: Number(formData.serious_illness),
      avg_performance: Number(formData.avg_performance),
      company_id: formData.company_id,
    };

    toast.loading("Updating report...", { id: "updateReportToast" });
    dispatch(updateEmployeeReportFn(payload));
  };

  useEffect(() => {
    if (updateState.IsSuccess) {
      toast.success("Report updated successfully!", { id: "updateReportToast" });
      dispatch(resetUpdateEmployeeReport());
      navigate(-1);
    }
    if (updateState.isError) {
      toast.error(updateState.errorMsg || "Update failed", {
        id: "updateReportToast",
      });
    }
  }, [updateState, dispatch, navigate]);

  if (!report) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-4">

      <div className="flex justify-between items-center mb-4">
              <SideParsm />
              <Nav />
            </div>
      <h1 className="font-semibold text-lg mb-3">Update Employee Report</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Month</label>
            <input
              type="number"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">New Employees</label>
            <input
              type="number"
              name="new_employees"
              value={formData.new_employees}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Left Employees</label>
            <input
              type="number"
              name="left_employees"
              value={formData.left_employees}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Deaths</label>
            <input
              type="number"
              name="death"
              value={formData.death}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Serious Illness</label>
            <input
              type="number"
              name="serious_illness"
              value={formData.serious_illness}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Average Performance</label>
            <input
              type="number"
              name="avg_performance"
              value={formData.avg_performance}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#605BFF] text-white p-2 rounded-md mt-4 w-1/4"
        >
          Update Report
        </button>
      </form>
    </div>
  );
}

export default UpdateEmployeeReport;

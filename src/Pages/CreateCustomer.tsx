import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { getAllServicesFn } from "@/Redux/Slice/Services/allServices";
import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { GoPlus } from "react-icons/go";
import { CiTrash } from "react-icons/ci";
import { createCustomerReportFn, resetCustomerReport } from "@/Redux/Slice/customerReportSlice/CreateSlice";

function CreateCustomerReport() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: services } = useSelector((state: RootState) => state.AllServices);
  const createReportState = useSelector((state: RootState) => state.CreateCustomerR);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const toastId = "customerReportToast";

  // Initialize all inputs as empty strings
  const [reports, setReports] = useState([
    {
      month: currentMonth,
      year: new Date().getFullYear().toString(),
      total_customers: "",
      customer_growth_rate: "",
      churn_rate: "",
      total_active: "",
      metrics: [] as { service_id: number; active_users: string; target_value: string }[],
    },
  ]);

  // Fetch services
  useEffect(() => {
    dispatch(getAllServicesFn({ page: 1, pageSize: 100, search: "" }));
  }, [dispatch]);

  // Initialize metrics for first report when services are loaded
  useEffect(() => {
    if (services.length && reports[0].metrics.length === 0) {
      setReports((prev) => [
        {
          ...prev[0],
          metrics: services.map((s) => ({
            service_id: s.service_id,
            active_users: "",
            target_value: "",
          })),
        },
      ]);
    }
  }, [services]);

  const handleAddNewReport = () => {
    setReports([
      ...reports,
      {
        month: currentMonth,
        year: new Date().getFullYear().toString(),
        total_customers: "",
        customer_growth_rate: "",
        churn_rate: "",
        total_active: "",
        metrics: services.map((s: any) => ({
          service_id: s.service_id,
          active_users: "",
          target_value: "",
        })),
      },
    ]);
  };

  const handleDeleteReport = (index: number) => {
    const updated = [...reports];
    updated.splice(index, 1);
    setReports(updated);
  };

  // Update main report fields
  const handleReportChange = (
    index: number,
    field: "month" | "year" | "total_customers" | "customer_growth_rate" | "churn_rate" | "total_active",
    value: string
  ) => {
    const updated = [...reports];
    updated[index] = { ...updated[index], [field]: value };
    setReports(updated);
  };

  // Update service metrics
  const handleMetricChange = (
    reportIdx: number,
    serviceId: number,
    field: "active_users" | "target_value",
    value: string
  ) => {
    const updated = [...reports];
    updated[reportIdx].metrics = updated[reportIdx].metrics.map((m) =>
      m.service_id === serviceId ? { ...m, [field]: value } : m
    );
    setReports(updated);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).user.company_id;

      const reportsWithCompany = reports.map((r) => ({
        company_id: Company_Id,
        month: Number(r.month.split("-")[1]),
        year: Number(r.year),
        total_customers: Number(r.total_customers) || 0,
        growth_rate: Number(r.customer_growth_rate) || 0,
        churn_rate: Number(r.churn_rate) || 0,
        total_active: Number(r.total_active) || 0,
        metrics: r.metrics.map((m) => ({
          service_id: m.service_id,
          active_users: Number(m.active_users) || 0,
          target_value: Number(m.target_value) || 0,
        })),
      }));

      dispatch(createCustomerReportFn(reportsWithCompany));
    } catch (error) {
      console.error("Company_Id not found", error);
      toast.error("User info not found. Please log in again.", { id: toastId });
    }
  };

  // Handle toast messages
  useEffect(() => {
    if (createReportState.isLoading) {
      toast.loading("Creating customer reports...", { id: toastId });
    } else if (createReportState.IsSuccess) {
      toast.success("Customer reports created successfully!", { id: toastId });
      setReports([
        {
          month: currentMonth,
          year: new Date().getFullYear().toString(),
          total_customers: "",
          customer_growth_rate: "",
          churn_rate: "",
          total_active: "",
          metrics: services.map((s: any) => ({
            service_id: s.service_id,
            active_users: "",
            target_value: "",
          })),
        },
      ]);
    } else if (createReportState.isError) {
      toast.error(createReportState.errorMsg, { id: toastId });
    }
    dispatch(resetCustomerReport());
  }, [createReportState, dispatch, services]);

  return (
    <div className="min-h-screen">
      <div className="p-3 flex justify-between items-center">
        <h1 className="lg:hidden"><SideParsm /></h1>
        <div className="navhome p-0 flex w-full justify-end"><Nav /></div>
      </div>

      <h1 className="font-semibold text-lg">Create Customer Report</h1>
      <form onSubmit={handleSubmit} className="bg-white my-2 p-4 rounded-[8px] w-full flex flex-col">
        <div className="flex gap-2 justify-end px-4 mb-4">
          <button type="button" className="p-2 flex gap-2 items-center" onClick={handleAddNewReport}>
            <span className="bg-[#E1E0FF] text-xl p-2 rounded-full"><GoPlus /></span>
            Add Report
          </button>
        </div>

        {reports.map((report, idx) => (
          <div key={idx} className="border rounded p-3 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col">
                <label>Month</label>
                <input
                  type="month"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={report.month}
                  onChange={(e) => handleReportChange(idx, "month", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label>Year</label>
                <input
                  type="number"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={report.year}
                  onChange={(e) => handleReportChange(idx, "year", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {["total_customers", "customer_growth_rate", "churn_rate", "total_active"].map((field) => (
                <div key={field} className="flex flex-col">
                  <label>{field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</label>
                  <input
                    type="number"
                    className="border border-gray-400 rounded-[10px] p-2"
                    value={report[field as keyof typeof report]}
                    onChange={(e) => handleReportChange(idx, field as any, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.metrics.map((metric, ) => {
                const service = services.find((s) => s.service_id === metric.service_id);
                if (!service) return null;

                return (
                  <div key={metric.service_id} className="border p-3 rounded">
                    <h3 className="font-semibold">{service.name}</h3>
                    <div className="flex flex-col">
                      <label>Active Users</label>
                      <input
                        type="number"
                        className="border border-gray-400 rounded-[10px] p-2"
                        value={metric.active_users}
                        onChange={(e) => handleMetricChange(idx, metric.service_id, "active_users", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col mt-2">
                      <label>Target Value</label>
                      <input
                        type="number"
                        className="border border-gray-400 rounded-[10px] p-2"
                        value={metric.target_value}
                        onChange={(e) => handleMetricChange(idx, metric.service_id, "target_value", e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {reports.length > 1 && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="px-4 py-2 flex items-center gap-2 rounded-lg text-red-500"
                  onClick={() => handleDeleteReport(idx)}
                >
                  <CiTrash /> Delete Report
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end my-4">
          <button
            type="submit"
            className="bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[30%] text-white p-2"
          >
            Save Reports
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCustomerReport;

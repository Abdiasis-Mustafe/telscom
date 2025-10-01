import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { getAllServicesFn } from "@/Redux/Slice/Services/allServices";

import {
  createCustomerReportFn,
  resetCustomerReport,
} from "@/Redux/Slice/customerReportSlice/CreateSlice";
import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { GoPlus } from "react-icons/go";
import { CiTrash } from "react-icons/ci";
import { getAllRegionsFn } from "@/Redux/Slice/RegionsSlice/AllRegions";

function CreateCustomerReport() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: services } = useSelector(
    (state: RootState) => state.AllServices
  );
  const { data: regions } = useSelector(
    (state: RootState) => state.GetAllReggions
  );
  const createReportState = useSelector(
    (state: RootState) => state.CreateCustomerR
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentYear = new Date().getFullYear();
  const toastId = "customerReportToast";

  const [reports, setReports] = useState([
    {
      month: currentMonth,
      year: currentYear.toString(),
      total_customers: "",
      customer_growth_rate: "",
      churn_rate: "",
      total_active: "",
      region_id: regions.length > 0 ? regions[0].region_id : 0,
      metrics: [] as {
        service_id: number;
        active_users: string;
        target_value: string;
      }[],
    },
  ]);

  // Fetch services + regions on mount
  useEffect(() => {
    dispatch(getAllServicesFn({ page: 1, pageSize: 100, search: "" }));
    dispatch(getAllRegionsFn({ page: 1, pageSize: 100, search: "" }));
  }, [dispatch]);

  // Initialize metrics + default region whenever services or regions change
  useEffect(() => {
    setReports((prev) =>
      prev.map((r) => ({
        ...r,
        metrics: services.map((s) => ({
          service_id: s.service_id,
          active_users: "",
          target_value: "",
        })),
        region_id: r.region_id || (regions.length > 0 ? regions[0].region_id : 0),
      }))
    );
  }, [services, regions]);

  const handleAddNewReport = () => {
    setReports((prev) => [
      ...prev,
      {
        month: currentMonth,
        year: currentYear.toString(),
        total_customers: "",
        customer_growth_rate: "",
        churn_rate: "",
        total_active: "",
        region_id: regions.length > 0 ? regions[0].region_id : 0,
        metrics: services.map((s) => ({
          service_id: s.service_id,
          active_users: "",
          target_value: "",
        })),
      },
    ]);
  };

  const handleDeleteReport = (index: number) => {
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReportChange = (
    index: number,
    field:
      | "month"
      | "year"
      | "total_customers"
      | "customer_growth_rate"
      | "churn_rate"
      | "total_active",
    value: string
  ) => {
    setReports((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleMetricChange = (
    reportIdx: number,
    serviceId: number,
    field: "active_users" | "target_value",
    value: string
  ) => {
    setReports((prev) =>
      prev.map((r, i) =>
        i === reportIdx
          ? {
              ...r,
              metrics: r.metrics.map((m) =>
                m.service_id === serviceId ? { ...m, [field]: value } : m
              ),
            }
          : r
      )
    );
  };

  const handleRegionChange = (index: number, regionId: number) => {
    setReports((prev) =>
      prev.map((r, i) => (i === index ? { ...r, region_id: regionId } : r))
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).user
        .company_id;

      const payload = reports.map((r) => ({
        company_id: Company_Id,
        region_id: r.region_id,
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

      dispatch(createCustomerReportFn(payload));
    } catch (error) {
      console.error(error);
      toast.error("User info not found. Please log in again.", { id: toastId });
    }
  };

  useEffect(() => {
    if (createReportState.isLoading) {
      toast.loading("Creating customer reports...", { id: toastId });
    } else if (createReportState.IsSuccess) {
      toast.success("Customer reports created successfully!", { id: toastId });
      // Reset form
      setReports([
        {
          month: currentMonth,
          year: currentYear.toString(),
          total_customers: "",
          customer_growth_rate: "",
          churn_rate: "",
          total_active: "",
          region_id: regions.length > 0 ? regions[0].region_id : 0,
          metrics: services.map((s) => ({
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
  }, [createReportState, dispatch, services, regions]);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <SideParsm />
        <Nav />
      </div>

      <h1 className="text-lg font-semibold mb-4">Create Customer Report</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded p-4 flex flex-col gap-4"
      >
        <div className="flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 p-2 bg-gray-100 rounded"
            onClick={handleAddNewReport}
          >
            <GoPlus /> Add Report
          </button>
        </div>

        {reports.map((report, idx) => (
          <div key={idx} className="border rounded p-4 flex flex-col gap-4">
            {/* Month, Year, Region */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col">
                <label>Month</label>
                <input
                  type="month"
                  value={report.month}
                  onChange={(e) =>
                    handleReportChange(idx, "month", e.target.value)
                  }
                  className="border rounded p-2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label>Year</label>
                <input
                  type="number"
                  value={report.year}
                  onChange={(e) =>
                    handleReportChange(idx, "year", e.target.value)
                  }
                  className="border rounded p-2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label>Region</label>
                <select
                  value={report.region_id}
                  onChange={(e) =>
                    handleRegionChange(idx, Number(e.target.value))
                  }
                  className="border rounded p-2"
                  required
                >
                  <option value={0}>Select Region</option>
                  {regions.map((r) => (
                    <option key={r.region_id} value={r.region_id}>
                      {r.region_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "total_customers",
                "customer_growth_rate",
                "churn_rate",
                "total_active",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label>
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <input
                    type="number"
                    value={report[field as keyof typeof report]}
                    onChange={(e) =>
                      handleReportChange(idx, field as any, e.target.value)
                    }
                    className="border rounded p-2"
                  />
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.metrics.map((metric) => {
                const service = services.find(
                  (s) => s.service_id === metric.service_id
                );
                if (!service) return null;
                return (
                  <div key={metric.service_id} className="border p-3 rounded">
                    <h3 className="font-semibold">{service.name}</h3>
                    <div className="flex flex-col mt-2">
                      <label>Active Users</label>
                      <input
                        type="number"
                        value={metric.active_users}
                        onChange={(e) =>
                          handleMetricChange(
                            idx,
                            metric.service_id,
                            "active_users",
                            e.target.value
                          )
                        }
                        className="border rounded p-2"
                      />
                    </div>
                    <div className="flex flex-col mt-2">
                      <label>Target Value</label>
                      <input
                        type="number"
                        value={metric.target_value}
                        onChange={(e) =>
                          handleMetricChange(
                            idx,
                            metric.service_id,
                            "target_value",
                            e.target.value
                          )
                        }
                        className="border rounded p-2"
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
                  onClick={() => handleDeleteReport(idx)}
                  className="flex items-center gap-2 text-red-500 px-4 py-2 rounded-lg"
                >
                  <CiTrash /> Delete Report
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#605BFF] text-white rounded p-2 w-1/3"
          >
            Save Reports
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCustomerReport;
import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/Redux/Store";
import {
  GetSingleCustomerFn,
  resetSingleCustomer,
} from "@/Redux/Slice/customerReportSlice/SingleCustomerReport";

import { SingleServiceFN } from "@/Redux/Slice/Services/singleServiceSlice";
import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { resetUpdateCustomerReport, updateCustomerReportFn } from "@/Redux/Slice/Services/UpdateServiceSlice";

function UpdateCustomerReport() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data, isLoading } = useSelector(
    (state: RootState) => state.SingleCustomerR
  );
  const updateState = useSelector(
    (state: RootState) => state.UpdateCustomerR
  );
  const services = useSelector((state: RootState) => state.Oneservice.byId);

  const [report, setReport] = useState<any>(null);
  const toastId = "updateCustomerToast";

  // Fetch single report
  useEffect(() => {
    if (id) dispatch(GetSingleCustomerFn(Number(id)));
    return () => {
      dispatch(resetSingleCustomer());
    };
  }, [id, dispatch]);

  // Prefill state when data arrives
  useEffect(() => {
    if (data) {
      setReport({
        month: `${data.year}-${String(data.month).padStart(2, "0")}`,
        year: String(data.year),
        total_customers: String(data.total_customers),
        customer_growth_rate: String(data.growth_rate),
        churn_rate: String(data.churn_rate),
        // total_active: String(data.total_active),
        metrics: data.metrics.map((m: any) => ({
          service_id: m.service_id,
          active_users: String(m.active_users),
          target_value: String(m.target_value),
        })),
      });

      // fetch service names
      data.metrics.forEach((m: any) => {
        if (!services[m.service_id]) {
          dispatch(SingleServiceFN(m.service_id));
        }
      });
    }
  }, [data, dispatch, services]);

  const handleReportChange = (
    field: "month" | "year" | "total_customers" | "customer_growth_rate" | "churn_rate" | "total_active",
    value: string
  ) => {
    if (!report) return;
    setReport({ ...report, [field]: value });
  };

  const handleMetricChange = (
    serviceId: number,
    field: "active_users" | "target_value",
    value: string
  ) => {
    if (!report) return;
    setReport({
      ...report,
      metrics: report.metrics.map((m: any) =>
        m.service_id === serviceId ? { ...m, [field]: value } : m
      ),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!report || !id) return;

    try {
      const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).user.company_id;

      const payload = {
        id: Number(id),
        company_id: Company_Id,
        month: Number(report.month.split("-")[1]),
        year: Number(report.year),
        total_customers: Number(report.total_customers) || 0,
        growth_rate: Number(report.customer_growth_rate) || 0,
        churn_rate: Number(report.churn_rate) || 0,
        total_active: Number(report.total_active) || 0,
        metrics: report.metrics.map((m: any) => ({
          service_id: m.service_id,
          active_users: Number(m.active_users) || 0,
          target_value: Number(m.target_value) || 0,
        })),
      };

      dispatch(updateCustomerReportFn(payload));
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Could not update report", { id: toastId });
    }
  };

  // Handle toast updates
  useEffect(() => {
    if (updateState.isLoading) {
      toast.loading("Updating report...", { id: toastId });
    } else if (updateState.IsSuccess) {
      toast.success("Report updated successfully!", { id: toastId });
      navigate(`/customers/${id}`); // redirect back to detail page
    } else if (updateState.isError) {
      toast.error(updateState.errorMsg, { id: toastId });
    }
    dispatch(resetUpdateCustomerReport());
  }, [updateState, dispatch, navigate, id]);

  if (isLoading || !report) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="min-h-screen">
      <div className="p-3 flex justify-between items-center">
        <h1 className="lg:hidden"><SideParsm /></h1>
        <div className="navhome p-0 flex w-full justify-end"><Nav /></div>
      </div>

      <h1 className="font-semibold text-lg mb-4">Update Customer Report</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <label>Month</label>
            <input
              type="month"
              value={report.month}
              className="border border-gray-400 rounded p-2"
              onChange={(e) => handleReportChange("month", e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>Year</label>
            <input
              type="number"
              value={report.year}
              className="border border-gray-400 rounded p-2"
              onChange={(e) => handleReportChange("year", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {["total_customers", "customer_growth_rate", "churn_rate", "total_active"].map((field) => (
            <div key={field} className="flex flex-col">
              <label>{field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</label>
              <input
                type="number"
                value={report[field]}
                className="border border-gray-400 rounded p-2"
                onChange={(e) => handleReportChange(field as any, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.metrics.map((metric: any) => {
            const service = services[metric.service_id];
            return (
              <div key={metric.service_id} className="border p-3 rounded">
                <h3 className="font-semibold">{service?.name || `Service ${metric.service_id}`}</h3>
                <div className="flex flex-col">
                  <label>Active Users</label>
                  <input
                    type="number"
                    value={metric.active_users}
                    className="border border-gray-400 rounded p-2"
                    onChange={(e) =>
                      handleMetricChange(metric.service_id, "active_users", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label>Target Value</label>
                  <input
                    type="number"
                    value={metric.target_value}
                    className="border border-gray-400 rounded p-2"
                    onChange={(e) =>
                      handleMetricChange(metric.service_id, "target_value", e.target.value)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-[#605BFF] rounded shadow-md px-6 py-2 text-white"
          >
            Update Report
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateCustomerReport;

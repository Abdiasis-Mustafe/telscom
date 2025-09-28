import React, { useState, useEffect, FormEvent } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { toast } from "react-hot-toast";
import { createEmployeeReportFn, resetEmployeeReport } from "@/Redux/Slice/Employe/CreateEmployesSlice";
import { getAllComppaniesFn } from "@/Redux/Slice/companies/allCompaniesSlice";
import SideParsm from "@/components/SideParsm";
import Nav from "@/components/Nav";
import { GoPlus } from "react-icons/go";
import { CiImport, CiTrash } from "react-icons/ci";

function CreateEmployeeReport() {
  const dispatch = useDispatch<AppDispatch>();
  const AllCompanyState = useSelector((state: RootState) => state.getAllcompaines);
  const { isLoading, isError, IsSuccess, errorMsg } = useSelector(
    (state: RootState) => state.CreateEmployee
  );

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const emptyForm = {
    month: currentMonth,
    new_employees: 0,
    employees_left: 0,
    death: 0,
    serious_illness: 0,
    average_performance: "",
    company_id: "",
  };

  const [formInputs, setFormInputs] = useState([emptyForm]);

  // Load companies
  useEffect(() => {
    dispatch(getAllComppaniesFn());
  }, [dispatch]);

  const companies = Array.isArray(AllCompanyState.data)
    ? AllCompanyState.data.map((company: any) => ({
        id: company.company_id,
        name: company.company_name,
      }))
    : [];

  // Add new row
  const handleAddNewInput = () => setFormInputs([...formInputs, emptyForm]);

  // Delete row
  const handleDelete = (index: number) =>
    setFormInputs((prev) => prev.filter((_, i) => i !== index));

  // Handle input change
  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedInputs = [...formInputs];
    updatedInputs[index] = { ...updatedInputs[index], [field]: value };
    setFormInputs(updatedInputs);
  };

  // Excel import
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const formattedData = data.slice(1).map((row) => {
        const [month, new_employees, employees_left, death, serious_illness, average_performance, company_id] = row;
        return {
          month: month || currentMonth,
          new_employees: Number(new_employees) || 0,
          employees_left: Number(employees_left) || 0,
          death: Number(death) || 0,
          serious_illness: Number(serious_illness) || 0,
          average_performance: average_performance || "",
          company_id: company_id || "",
        };
      });

      setFormInputs(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  // Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const transformedData = formInputs.map((input) => {
      const [yearStr, monthStr] = input.month.split("-");
      return {
        month: Number(monthStr),
        year: Number(yearStr),
        new_employees: Number(input.new_employees),
        left_employees: Number(input.employees_left),
        death: Number(input.death),
        serious_illness: Number(input.serious_illness),
        avg_performance: isNaN(Number(input.average_performance)) ? 0 : Number(input.average_performance),
        company_id: input.company_id || JSON.parse(localStorage.getItem("userInfo")!).company_id,
      };
    });

    toast.loading("Creating Employee Report(s)...", { id: "employeeReportToast" });
    dispatch(createEmployeeReportFn(transformedData));
  };

  // Toast & reset
  useEffect(() => {
    if (IsSuccess) {
      toast.success("Employee Report(s) created successfully!", { id: "employeeReportToast" });
      setFormInputs([emptyForm]); // Reset forms
      dispatch(resetEmployeeReport());
    }

    if (isError) {
      toast.error(errorMsg || "Failed to create report(s)", { id: "employeeReportToast" });
    }
  }, [IsSuccess, isError, errorMsg, dispatch]);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <SideParsm />
        <Nav />
      </div>

      <h1 className="font-semibold text-lg mb-3">Create Employee Report(s)</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:text-black p-4 rounded-lg flex flex-col gap-4">
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="bg-[#008CC8] px-2 gap-2 flex items-center text-white rounded-xl"
            onClick={() => document.getElementById("excel-import")?.click()}
          >
            <CiImport /> Import Excel
          </button>
          <input
            id="excel-import"
            type="file"
            accept=".csv,.xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="p-2 flex gap-2 items-center"
            onClick={handleAddNewInput}
          >
            <GoPlus /> Add New
          </button>
        </div>

        {formInputs.map((input, index) => (
          <div key={index} className="border p-3 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Month */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Month</label>
                <input
                  type="month"
                  value={input.month}
                  onChange={(e) => handleInputChange(index, "month", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>

              {/* New Employees */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">New Employees</label>
                <input
                  type="number"
                  value={input.new_employees}
                  onChange={(e) => handleInputChange(index, "new_employees", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>

              {/* Employees Left */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Employees Left</label>
                <input
                  type="number"
                  value={input.employees_left}
                  onChange={(e) => handleInputChange(index, "employees_left", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>

              {/* Deaths */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Deaths</label>
                <input
                  type="number"
                  value={input.death}
                  onChange={(e) => handleInputChange(index, "death", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>

              {/* Serious Illness */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Serious Illness</label>
                <input
                  type="number"
                  value={input.serious_illness}
                  onChange={(e) => handleInputChange(index, "serious_illness", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>

              {/* Average Performance */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Average Performance</label>
                <input
                  type="text"
                  value={input.average_performance}
                  onChange={(e) => handleInputChange(index, "average_performance", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="text-red-500 flex gap-1 items-center"
                onClick={() => handleDelete(index)}
              >
                <CiTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-[#605BFF] text-white p-2 rounded-md mt-4 w-1/4"
        >
          Create Employee Report(s)
        </button>
      </form>
    </div>
  );
}

export default CreateEmployeeReport;

import React, { useState, useEffect, FormEvent } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { toast } from "react-hot-toast";
import { RegisterFn, resetRegisterState } from "@/Redux/Slice/RegisterSlice";
import { getAllComppaniesFn } from "@/Redux/Slice/companies/allCompaniesSlice";
import SideParsm from "@/components/SideParsm";
import Nav from "@/components/Nav";
import { GoPlus } from "react-icons/go";
import { CiImport, CiTrash } from "react-icons/ci";

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const AllCompanyState = useSelector(
    (state: RootState) => state.getAllcompaines
  );
  const { isLoading, isError, isSuccess, errorMsg } = useSelector(
    (state: RootState) => state.user
  );

  // Default month (current month/year)
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Multiple employees (manual or Excel import)
  const [formInputs, setFormInputs] = useState([
    {
      full_name: "",
      email: "",
      password: "",
      role: "",
      company_id: "",
      new_employees: 0,
      employees_left: 0,
      death: 0,
      serious_illness: 0,
      average_performance: "",
      month: currentMonth,
    },
  ]);

  // Load companies for dropdown
  useEffect(() => {
    dispatch(getAllComppaniesFn());
  }, [dispatch]);

  const companies = Array.isArray(AllCompanyState.data)
    ? AllCompanyState.data.map((company: any) => ({
        id: company.company_id,
        name: company.company_name,
      }))
    : [];

  // Add new empty employee row
  const handleAddNewInput = () => {
    setFormInputs([
      ...formInputs,
      {
        full_name: "",
        email: "",
        password: "",
        role: "",
        company_id: "",
        new_employees: 0,
        employees_left: 0,
        death: 0,
        serious_illness: 0,
        average_performance: "",
        month: currentMonth,
      },
    ]);
  };

  // Delete row
  const handleDelete = (index: number) => {
    const updatedInputs = [...formInputs];
    updatedInputs.splice(index, 1);
    setFormInputs(updatedInputs);
  };

  // Handle input changes
  const handleInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
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

      // Expect headers like: full_name, email, password, role, company_id, new_employees, employees_left, death, serious_illness, average_performance, month
      const formattedData = data.slice(1).map((row) => {
        const [
          full_name,
          email,
          password,
          role,
          company_id,
          new_employees,
          employees_left,
          death,
          serious_illness,
          average_performance,
          month,
        ] = row;
        return {
          full_name: full_name || "",
          email: email || "",
          password: password || "",
          role: role || "",
          company_id: company_id || "",
          new_employees: Number(new_employees) || 0,
          employees_left: Number(employees_left) || 0,
          death: Number(death) || 0,
          serious_illness: Number(serious_illness) || 0,
          average_performance: average_performance || "",
          month: month || currentMonth,
        };
      });

      setFormInputs(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  // Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // dispatch(RegisterFn(formInputs));
  };

  // Handle toast + reset
  useEffect(() => {
    if (isSuccess) {
      toast.success("Employee(s) created!!", { id: "register" });
      setFormInputs([
        {
          full_name: "",
          email: "",
          password: "",
          role: "",
          company_id: "",
          new_employees: 0,
          employees_left: 0,
          death: 0,
          serious_illness: 0,
          average_performance: "",
          month: currentMonth,
        },
      ]);
    }
    if (isError) {
      toast.error(errorMsg, { id: "registerToast" });
    }
    dispatch(resetRegisterState());
  }, [isSuccess, isError, errorMsg, isLoading, dispatch, currentMonth]);

  return (
    <div className="min-h-screen">
      <div className="p-3 flex justify-between items-center">
        <h1 className="lg:hidden">
          <SideParsm />
        </h1>
        <div className="navhome p-0 flex w-full justify-end">
          <Nav />
        </div>
      </div>

      <h1 className="font-semibold text-lg">Create Employee(s)</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:text-black my-2 p-4 rounded-[8px] w-full flex flex-col"
      >
        {/* Import + Add buttons */}
        <div className="flex gap-2 justify-end px-4 mb-4">
          <button
            type="button"
            className="bg-[#008CC8] px-2 gap-2 flex items-center text-white rounded-xl"
            onClick={() => document.getElementById("excel-import")?.click()}
          >
            <span className="text-xl">
              <CiImport />
            </span>
            Import Excel
          </button>
          <input
            id="excel-import"
            type="file"
            accept=".csv, .xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="p-2 flex gap-2 items-center"
            onClick={handleAddNewInput}
          >
            <span className="bg-[#E1E0FF] text-xl p-2 rounded-full">
              <GoPlus />
            </span>
            Add New
          </button>
        </div>

        {formInputs.map((input, index) => (
          <div key={index} className="border rounded p-3 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              
              <div className="flex flex-col">
            <label>Month</label>
            <input
              type="month"
              className="border border-gray-400 rounded-[10px] p-2"
              value={input.month}
              onChange={(e) =>
                handleInputChange(index, "month", e.target.value) // stores YYYY-MM
              }
            />
          </div>
              <div className="flex flex-col">
                <label>New Employees</label>
                <input
                  type="number"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={input.new_employees}
                  onChange={(e) =>
                    handleInputChange(index, "new_employees", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Employees Left</label>
                <input
                  type="number"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={input.employees_left}
                  onChange={(e) =>
                    handleInputChange(index, "employees_left", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Deaths</label>
                <input
                  type="number"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={input.death}
                  onChange={(e) =>
                    handleInputChange(index, "death", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Serious Illness</label>
                <input
                  type="number"
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={input.serious_illness}
                  onChange={(e) =>
                    handleInputChange(index, "serious_illness", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label>Average Performance</label>
                <input
                  type="text"
                  placeholder="Excellent, Good, Fair..."
                  className="border border-gray-400 rounded-[10px] p-2"
                  value={input.average_performance}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "average_performance",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="px-4 py-2 flex items-center gap-2 rounded-lg text-red-500"
                onClick={() => handleDelete(index)}
              >
                <CiTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end my-4">
          <button
            type="submit"
            className="bg-[#605BFF] rounded-[8px] shadow-[0_4px_23.5px_rgba(96,91,255,1)] flex justify-center w-[20%] text-white p-2"
          >
            Create Employee(s)
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;

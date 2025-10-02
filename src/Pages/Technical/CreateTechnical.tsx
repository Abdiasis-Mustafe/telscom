import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";

import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { GoPlus } from "react-icons/go";
import { CiTrash } from "react-icons/ci";
import { createTechnicalReportFn, clearSuccess, clearError } from "@/Redux/Slice/technical/TechnicalSlice";

function CreateTechnicalReport() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isSuccess, isError, errorMsg } = useSelector(
    (state: RootState) => state.Technical
  );

  const currentMonth = new Date().getMonth() + 1; // numeric month
  const currentYear = new Date().getFullYear();
  const toastId = "technicalReportToast";

  const [reports, setReports] = useState([
    {
      month: currentMonth,
      year: currentYear,
      achievements: [{ title: "", description: "" }],
      challenges: [{ title: "", description: "" }],
    },
  ]);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAddNewReport = () => {
    setReports((prev) => [
      ...prev,
      {
        month: currentMonth,
        year: currentYear,
        achievements: [{ title: "", description: "" }],
        challenges: [{ title: "", description: "" }],
      },
    ]);
  };

  const handleDeleteReport = (index: number) => {
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReportChange = (
    index: number,
    field: "month" | "year",
    value: number
  ) => {
    setReports((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleAchievementChange = (
    reportIdx: number,
    achIdx: number,
    field: "title" | "description",
    value: string
  ) => {
    setReports((prev) =>
      prev.map((r, i) =>
        i === reportIdx
          ? {
              ...r,
              achievements: r.achievements.map((a, j) =>
                j === achIdx ? { ...a, [field]: value } : a
              ),
            }
          : r
      )
    );
  };

  const handleChallengeChange = (
    reportIdx: number,
    chIdx: number,
    field: "title" | "description",
    value: string
  ) => {
    setReports((prev) =>
      prev.map((r, i) =>
        i === reportIdx
          ? {
              ...r,
              challenges: r.challenges.map((c, j) =>
                j === chIdx ? { ...c, [field]: value } : c
              ),
            }
          : r
      )
    );
  };

  const addAchievement = (reportIdx: number) => {
    setReports((prev) =>
      prev.map((r, i) =>
        i === reportIdx
          ? { ...r, achievements: [...r.achievements, { title: "", description: "" }] }
          : r
      )
    );
  };

  const addChallenge = (reportIdx: number) => {
    setReports((prev) =>
      prev.map((r, i) =>
        i === reportIdx
          ? { ...r, challenges: [...r.challenges, { title: "", description: "" }] }
          : r
      )
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    try {
      const Company_Id = JSON.parse(localStorage.getItem("userInfo")!).user
        .company_id;

      const payload = reports.map((r) => ({
        company_id: Company_Id,
        month: r.month,
        year: r.year,
        achievements: r.achievements,
        challenges: r.challenges,
      }));

      dispatch(createTechnicalReportFn(payload as any));
    } catch (error) {
      console.error(error);
      toast.error("User info not found. Please log in again.", { id: toastId });
    }
  };

  useEffect(() => {
    if (isLoading) {
      toast.loading("Creating technical reports...", { id: toastId });
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess && hasSubmitted) {
      toast.success("Technical reports created successfully!", { id: toastId });
      // Reset form
      setReports([
        {
          month: currentMonth,
          year: currentYear,
          achievements: [{ title: "", description: "" }],
          challenges: [{ title: "", description: "" }],
        },
      ]);
      setHasSubmitted(false);
      // Clear success state after a delay to ensure toast is shown
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 1000);
    }
  }, [isSuccess, hasSubmitted, dispatch]);

  useEffect(() => {
    if (isError && hasSubmitted) {
      toast.error(errorMsg, { id: toastId });
      setHasSubmitted(false);
      // Clear error state after a delay to ensure toast is shown
      setTimeout(() => {
        dispatch(clearError());
      }, 1000);
    }
  }, [isError, errorMsg, hasSubmitted, dispatch]);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <SideParsm />
        <Nav />
      </div>

      <h1 className="text-lg font-semibold mb-4">Create Technical Report</h1>

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
            {/* Month, Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label>Month</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={report.month}
                  onChange={(e) =>
                    handleReportChange(idx, "month", Number(e.target.value))
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
                    handleReportChange(idx, "year", Number(e.target.value))
                  }
                  className="border rounded p-2"
                  required
                />
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-semibold">Achievements</h3>
              {report.achievements.map((ach, aIdx) => (
                <div
                  key={aIdx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={ach.title}
                    onChange={(e) =>
                      handleAchievementChange(idx, aIdx, "title", e.target.value)
                    }
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={ach.description}
                    onChange={(e) =>
                      handleAchievementChange(
                        idx,
                        aIdx,
                        "description",
                        e.target.value
                      )
                    }
                    className="border rounded p-2"
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 text-blue-500"
                onClick={() => addAchievement(idx)}
              >
                + Add Achievement
              </button>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="font-semibold">Challenges</h3>
              {report.challenges.map((ch, cIdx) => (
                <div
                  key={cIdx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={ch.title}
                    onChange={(e) =>
                      handleChallengeChange(idx, cIdx, "title", e.target.value)
                    }
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={ch.description}
                    onChange={(e) =>
                      handleChallengeChange(
                        idx,
                        cIdx,
                        "description",
                        e.target.value
                      )
                    }
                    className="border rounded p-2"
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 text-blue-500"
                onClick={() => addChallenge(idx)}
              >
                + Add Challenge
              </button>
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
            disabled={isLoading}
            className="bg-[#605BFF] text-white rounded p-2 w-1/3 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Save Reports"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTechnicalReport;
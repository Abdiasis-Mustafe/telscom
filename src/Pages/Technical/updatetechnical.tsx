import React, { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/Redux/Store";
import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { GoPlus } from "react-icons/go";
import { CiTrash } from "react-icons/ci";
import { 
  fetchTechnicalReport, 
  updateTechnicalReportFn, 
  clearSuccess, 
  clearError 
} from "@/Redux/Slice/technical/TechnicalSlice";

function UpdateTechnicalReport() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { 
    singleReport, 
    isLoading, 
    isSuccess, 
    isError, 
    errorMsg 
  } = useSelector((state: RootState) => state.Technical);

  const toastId = "technicalReportToast";

  const [report, setReport] = useState({
    month: 0,
    year: 0,
    achievements: [{ title: "", description: "" }],
    challenges: [{ title: "", description: "" }],
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  
  useEffect(() => {
    if (id) {
      dispatch(fetchTechnicalReport(Number(id)));
    }
  }, [dispatch, id]);

  
useEffect(() => {
  if (singleReport) {
    setReport({
      month: singleReport.month,
      year: singleReport.year,
      achievements: singleReport.achievements.length > 0 
        ? singleReport.achievements.map(a => ({
            title: a.title ?? "",
            description: a.description ?? "",  // ✅ ensure string
          }))
        : [{ title: "", description: "" }],
      challenges: singleReport.challenges.length > 0 
        ? singleReport.challenges.map(c => ({
            title: c.title ?? "",
            description: c.description ?? "",  // ✅ ensure string
          }))
        : [{ title: "", description: "" }],
    });
  }
}, [singleReport]);


  const handleReportChange = (
    field: "month" | "year",
    value: number
  ) => {
    setReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleAchievementChange = (
    achIdx: number,
    field: "title" | "description",
    value: string
  ) => {
    setReport((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a, j) =>
        j === achIdx ? { ...a, [field]: value } : a
      ),
    }));
  };

  const handleChallengeChange = (
    chIdx: number,
    field: "title" | "description",
    value: string
  ) => {
    setReport((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c, j) =>
        j === chIdx ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addAchievement = () => {
    setReport((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { title: "", description: "" }],
    }));
  };

  const addChallenge = () => {
    setReport((prev) => ({
      ...prev,
      challenges: [...prev.challenges, { title: "", description: "" }],
    }));
  };

  const removeAchievement = (index: number) => {
    setReport((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const removeChallenge = (index: number) => {
    setReport((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    try {
      if (!id) {
        toast.error("Report ID not found", { id: toastId });
        return;
      }

      const payload = {
        month: report.month,
        year: report.year,
        achievements: report.achievements,
        challenges: report.challenges,
      };

      dispatch(updateTechnicalReportFn({ 
        id: Number(id), 
        data: payload 
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to update report", { id: toastId });
    }
  };

  // Loading effect for fetching
//   useEffect(() => {
//     if (isLoading && !hasSubmitted) {
//       toast.loading("Loading report...", { id: toastId });
//     }
//   }, [isLoading, hasSubmitted]);

  // Loading effect for updating
  useEffect(() => {
    if (isLoading && hasSubmitted) {
      toast.loading("Updating technical report...", { id: toastId });
    }
  }, [isLoading, hasSubmitted]);

  // Success effect
  useEffect(() => {
    if (isSuccess && hasSubmitted) {
      toast.success("Technical report updated successfully!", { id: toastId });
      setHasSubmitted(false);
      
      // Navigate back after success
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate("/Dashboard/Technical"); // Adjust route as needed
      }, 1500);
    }
  }, [isSuccess, hasSubmitted, dispatch, navigate]);

  // Error effect
  useEffect(() => {
    if (isError && hasSubmitted) {
      toast.error(errorMsg, { id: toastId });
      setHasSubmitted(false);
      setTimeout(() => {
        dispatch(clearError());
      }, 1000);
    }
  }, [isError, errorMsg, hasSubmitted, dispatch]);

  // Show loading while fetching data
  if (isLoading && !singleReport && !hasSubmitted) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <SideParsm />
          <Nav />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading report...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <SideParsm />
        <Nav />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Update Technical Report</h1>
        <button
          type="button"
          onClick={() => navigate("/Dashboard/Technical")}
          className="bg-gray-500 text-white rounded px-4 py-2"
        >
          Back to Reports
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded p-4 flex flex-col gap-4"
      >
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
                handleReportChange("month", Number(e.target.value))
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
                handleReportChange("year", Number(e.target.value))
              }
              className="border rounded p-2"
              required
            />
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Achievements</h3>
            <button
              type="button"
              className="text-blue-500 flex items-center gap-1"
              onClick={addAchievement}
            >
              <GoPlus /> Add Achievement
            </button>
          </div>
          
          {report.achievements.map((ach, aIdx) => (
            <div
              key={aIdx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 border p-3 rounded"
            >
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Title"
                  value={ach.title}
                  onChange={(e) =>
                    handleAchievementChange(aIdx, "title", e.target.value)
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={ach.description}
                  onChange={(e) =>
                    handleAchievementChange(aIdx, "description", e.target.value)
                  }
                  className="border rounded p-2 flex-1"
                />
                {report.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAchievement(aIdx)}
                    className="text-red-500 p-2"
                  >
                    <CiTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Challenges */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Challenges</h3>
            <button
              type="button"
              className="text-blue-500 flex items-center gap-1"
              onClick={addChallenge}
            >
              <GoPlus /> Add Challenge
            </button>
          </div>
          
          {report.challenges.map((ch, cIdx) => (
            <div
              key={cIdx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 border p-3 rounded"
            >
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Title"
                  value={ch.title}
                  onChange={(e) =>
                    handleChallengeChange(cIdx, "title", e.target.value)
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={ch.description}
                  onChange={(e) =>
                    handleChallengeChange(cIdx, "description", e.target.value)
                  }
                  className="border rounded p-2 flex-1"
                />
                {report.challenges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChallenge(cIdx)}
                    className="text-red-500 p-2"
                  >
                    <CiTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/Technical")}
            className="bg-gray-500 text-white rounded px-6 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#605BFF] text-white rounded px-6 py-2 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Report"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateTechnicalReport;
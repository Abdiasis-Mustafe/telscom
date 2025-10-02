import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { deleteTechnicalReportFn, fetchAllTechnicalReports } from "@/Redux/Slice/technical/TechnicalSlice";
import { Link } from "react-router-dom";

const ActionButtons = ({ row, onDeleteClick }: any) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ justifyContent: "center", width: "100%" }}
    > 
      <Link to={`/dashboard/Technical/veiw/${row.id}`}>
      <Button
        variant="contained"
        size="small"
        startIcon={<VisibilityIcon />}
        sx={{
          bgcolor: "#6c757d",
          color: "#fff",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#5a6268" },
        }}
        onClick={() => console.log("View", row)}
      >
        View
      </Button>
      </Link>
        <Link to={`/dashboard/Technical/update/${row.id}`}>
      <Button
        variant="contained"
        size="small"
        startIcon={<EditIcon />}
        sx={{
          bgcolor: "#007bff",
          color: "#fff",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#0069d9" },
        }}
        onClick={() => console.log("Edit", row)}
      >
        Update
      </Button>
      </Link>
      <Link to={'#'}>
      <Button
        variant="contained"
        size="small"
        startIcon={<DeleteIcon />}
        sx={{
          bgcolor: "#dc3545",
          color: "#fff",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#c82333" },
        }}
        onClick={() => onDeleteClick(row)}
      >
        Delete
      </Button>
      </Link>
    </Stack>
  );
};

export default function TechnicalReportsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const technicalState = useSelector((state: RootState) => state.Technical);
  
  const {
    reports = [],
    total = 0,
    isLoading,
  } = technicalState;

  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    reportToDelete: null as any,
  });

  // Fetch data
  useEffect(() => {
    dispatch(
      fetchAllTechnicalReports({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
         search: searchText,
      })
    );
  }, [dispatch, paginationModel, searchText]);

  // Handle delete button click
  const handleDeleteClick = (report: any) => {
    setDeleteDialog({
      open: true,
      reportToDelete: report,
    });
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deleteDialog.reportToDelete) {
      dispatch(deleteTechnicalReportFn(deleteDialog.reportToDelete.id));
      setDeleteDialog({
        open: false,
        reportToDelete: null,
      });
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteDialog({
      open: false,
      reportToDelete: null,
    });
  };

  // PRE-PROCESS THE DATA - Transform achievements and challenges into strings
  const processedRows = reports.map((report: any) => {
    // Process achievements
    const achievementTitles = report.achievements && Array.isArray(report.achievements)
      ? report.achievements
          .map((item: any) => item?.title)
          .filter((title: string) => title && title.trim() !== "")
          .join(", ") || "-"
      : "-";

    // Process challenges
    const challengeTitles = report.challenges && Array.isArray(report.challenges)
      ? report.challenges
          .map((item: any) => item?.title)
          .filter((title: string) => title && title.trim() !== "")
          .join(", ") || "-"
      : "-";

    return {
      id: report.id,
      month: report.month,
      year: report.year,
      company: report.company?.company_name || "N/A",
      achievements: achievementTitles, // Pre-processed string
      challenges: challengeTitles, // Pre-processed string
      rawData: report // Keep original data for actions
    };
  });

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "month",
      headerName: "Month",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "year",
      headerName: "Year",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "company",
      headerName: "Company",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "achievements",
      headerName: "Achievements",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "challenges",
      headerName: "Challenges",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ActionButtons 
          row={params.row.rawData} 
          onDeleteClick={handleDeleteClick}
        />
      ),
    },
  ];

  return (
    <Box sx={{ flex: 1, width: "95%", padding: 4 }}>
      {/* Title + Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <h2 style={{ fontWeight: "bold", fontSize: 18 }}>
          Technical Reports Table
        </h2>
        <TextField
          label="Search..."
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
        />
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={processedRows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50]}
        rowCount={total}
        paginationMode="server"
        autoHeight
        loading={isLoading}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#F5F5F5" },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#F9F9F9" },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: "bold" }}>
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this technical report?
            </Typography>
            {deleteDialog.reportToDelete && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Report Details:
                </Typography>
                <Typography variant="body2">
                  <strong>ID:</strong> {deleteDialog.reportToDelete.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Company:</strong> {deleteDialog.reportToDelete.company?.company_name || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Month/Year:</strong> {deleteDialog.reportToDelete.month}/{deleteDialog.reportToDelete.year}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
              This action cannot be undone!
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
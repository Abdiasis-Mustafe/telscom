import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { CustomerReport, GetAllCustomerFn } from "@/Redux/Slice/customerReportSlice/AllCustomerReports";
import { deleteCustomerReportFn, resetDeleteCustomerReport } from "@/Redux/Slice/customerReportSlice/DeleteCustomerSlice";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// Action Buttons Component
const ActionButtons = ({ row, openDeleteDialog }: any) => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
    <Stack direction="row" spacing={1}>
      <Link to={`/Dashboard/Customers/detail/${row.id}`} style={{ textDecoration: "none" }}>
        <Button variant="contained" size="small" startIcon={<VisibilityIcon />} sx={{ bgcolor: "#6c757d", color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "#5a6268" } }}>View</Button>
      </Link>
      <Link to={`/Dashboard/Customers/update/${row.id}`} style={{ textDecoration: "none" }}>
        <Button variant="contained" size="small" startIcon={<EditIcon />} sx={{ bgcolor: "#007bff", color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "#0069d9" } }}>Update</Button>
      </Link>
      <Link to={`#`} style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        size="small"
        startIcon={<DeleteIcon />}
        sx={{ bgcolor: "#dc3545", color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "#c82333" } }}
        onClick={() => openDeleteDialog(row.id)}
      >
        Delete
      </Button>
      </Link>
    </Stack>
  </Box>
);

export default function CustomerSummaryTable() {
  const dispatch = useDispatch<AppDispatch>();
  const customarState = useSelector((state: RootState) => state.GetAllCustomersR);
  const deleteState = useSelector((state: RootState) => state.DeleteCustomerR);

  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(GetAllCustomerFn({ page: paginationModel.page + 1, pageSize: paginationModel.pageSize, search: searchText }));
  }, [dispatch, paginationModel, searchText]);

  useEffect(() => {
    if (deleteState.IsSuccess) {
      toast.success("Customer report deleted successfully!");
      dispatch(GetAllCustomerFn({ page: paginationModel.page + 1, pageSize: paginationModel.pageSize, search: searchText }));
      dispatch(resetDeleteCustomerReport());
      setOpenDialog(false);
      setSelectedId(null);
    } else if (deleteState.isError) {
      toast.error(deleteState.errorMsg || "Failed to delete report");
      dispatch(resetDeleteCustomerReport());
    }
  }, [deleteState, dispatch, paginationModel, searchText]);

  const openDeleteDialogHandler = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (selectedId !== null) {
      dispatch(deleteCustomerReportFn({ id: selectedId }));
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70, align: "center", headerAlign: "center" },
    { field: "month", headerName: "Month", width: 120, align: "center", headerAlign: "center" },
    { field: "total_customers", headerName: "Total Customers", width: 150, align: "center", headerAlign: "center" },
    { field: "growth_rate", headerName: "Growth Rate (%)", width: 130, align: "center", headerAlign: "center" },
    { field: "churn_rate", headerName: "Churn Rate (%)", width: 130, align: "center", headerAlign: "center" },
    { field: "action", headerName: "Action", width: 300, align: "center", headerAlign: "center", renderCell: (params) => <ActionButtons row={params.row} openDeleteDialog={openDeleteDialogHandler} /> },
  ];

  const rows = customarState.data.map((report: CustomerReport) => ({
    id: report.id,
    month: `${report.year}-${report.month.toString().padStart(2, "0")}`,
    total_customers: report.total_customers,
    growth_rate: report.growth_rate,
    churn_rate: report.churn_rate,
  }));

  return (
    <Box sx={{ flex: 1, width: "95%", padding: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h2>Customer Summary Table</h2>
        <TextField label="Search..." size="small" value={searchText} onChange={(e) => { setSearchText(e.target.value); setPaginationModel({ ...paginationModel, page: 0 }); }} />
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50]}
        rowCount={customarState.total ?? rows.length}
        paginationMode="server"
        autoHeight
        loading={customarState.isLoading || deleteState.isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this customer report?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

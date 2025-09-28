import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { getAllEmployersFn } from "@/Redux/Slice/Employe/AllEmloyers";

import { Link } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { delEmployeeFn } from "@/Redux/Slice/Employe/DeleteEmployesSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Action Buttons
const ActionButtons = ({ row, openDeleteDialog }: any) => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
    <Stack direction="row" spacing={1}>
      <Link to={`/Dashboard/Employees/Detail/${row.report_id}`} style={{ textDecoration: "none" }}>
        <Button variant="contained" size="small" startIcon={<VisibilityIcon />} sx={{ bgcolor: "#6c757d", color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "#5a6268" } }}>View</Button>
      </Link>
      <Link to={`/Dashboard/Employees/update/${row.report_id}`} style={{ textDecoration: "none" }}>
        <Button variant="contained" size="small" startIcon={<EditIcon />} sx={{ bgcolor: "#007bff", color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "#0069d9" } }}>Update</Button>
      </Link>
      <Link to={`#`} style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        size="small"
        startIcon={<DeleteIcon />}
        sx={{ bgcolor: "#dc3545", color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "#c82333" } }}
        onClick={() => openDeleteDialog(row.report_id)}
      >
        Delete
      </Button>
      </Link>
    </Stack>
  </Box>
);

export default function EmployeesReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data = [], total = 0, page = 1, pageSize = 10, isLoading } = useSelector(
    (state: RootState) => state.AllEmployes
  );

  const { isSuccess } = useSelector((state: RootState) => state.deleteEmployee);

  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize });

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(
      getAllEmployersFn({
        page: paginationModel.page + 1, // backend expects 1-based page
        pageSize: paginationModel.pageSize,
        search: searchText,
      })
    );
  }, [dispatch, paginationModel, searchText, isSuccess]);

  const openDeleteDialog = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(delEmployeeFn(deleteId));
      setOpen(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "report_id", headerName: "ID", width: 80, align: "center", headerAlign: "center" },
    { field: "month", headerName: "Month", width: 100, align: "center", headerAlign: "center" },
    { field: "year", headerName: "Year", width: 100, align: "center", headerAlign: "center" },
    { field: "new_employees", headerName: "New Employees", width: 150, align: "center", headerAlign: "center" },
    { field: "left_employees", headerName: "Left Employees", width: 150, align: "center", headerAlign: "center" },
    { field: "death", headerName: "Death", width: 100, align: "center", headerAlign: "center" },
    { field: "serious_illness", headerName: "Serious Illness", width: 150, align: "center", headerAlign: "center" },
    { field: "avg_performance", headerName: "Avg Performance", width: 150, align: "center", headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      width: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ActionButtons row={params.row} openDeleteDialog={openDeleteDialog} />,
    },
  ];

  return (
    <Box sx={{ flex: 1, width: "100%", padding: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <h2 style={{ fontWeight: "bold", fontSize: 18 }}>Employee Reports</h2>
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

      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.report_id}
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
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold !important" },
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center", justifyContent: "center" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#F9F9F9" },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>{"Are you sure you want to delete this report?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once deleted, this action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#6c757d" }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "#dc3545", fontWeight: "bold" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

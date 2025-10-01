import  { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { deleteRegionFn } from "@/Redux/Slice/RegionsSlice/DeleteRegionSlice";
import { getAllRegionsFn } from "@/Redux/Slice/RegionsSlice/AllRegions";
import { Link } from "react-router-dom";



const ActionButtons = ({ row }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "center", width: "100%" }}>
        <Link to={'#'}>
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
        <Link to={`/Dashboard/Regions/update/${row.id}`}>
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
        onClick={() => dispatch(deleteRegionFn({ id: row.region_id }))}
      >
        Delete
      </Button>
      </Link>
    </Stack>
  );
};

export default function AllRegionsData() {
  const dispatch = useDispatch<AppDispatch>();
  const { data = [], total = 0, page = 1, pageSize = 10, isLoading } = useSelector(
    (state: RootState) => state.GetAllReggions
  );

  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize });

  // Fetch regions whenever page, pageSize, or search changes
  useEffect(() => {
    dispatch(
      getAllRegionsFn({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: searchText,
      })
    );
  }, [dispatch, paginationModel, searchText]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70, align: "center", headerAlign: "center" },
    { field: "region_name", headerName: "Region Name", width: 200, align: "center", headerAlign: "center" },
    { field: "created_at", headerName: "Created At", width: 180, align: "center", headerAlign: "center" },
    { field: "updated_at", headerName: "Updated At", width: 180, align: "center", headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      width: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ActionButtons row={params.row} />,
    },
  ];

  return (
    <Box sx={{ flex: 1, width: "95%", padding: 4 }}>
      {/* Title + Search */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <h2 style={{ fontWeight: "bold", fontSize: 18 }}>Regions Table</h2>
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
        rows={data.map((region) => ({ id: region.region_id, ...region }))}
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
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold !important" },
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center", justifyContent: "center" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#F9F9F9" },
        }}
      />
    </Box>
  );
}

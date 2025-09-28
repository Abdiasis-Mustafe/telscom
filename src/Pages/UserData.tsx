import { AppDispatch, RootState } from "@/Redux/Store";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

import { delUserFn, resetDelUser } from "@/Redux/Slice/users/DeleteUser";
import { GetAllUserCompnyFN } from "@/Redux/Slice/users/getAllSlice";

// -------------------- Table Columns --------------------
const columns: GridColDef[] = [
  { field: "user_id", headerName: "Id", width: 100 },
  { field: "full_name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 300 },
  { field: "role", headerName: "Role of User", width: 200 },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    renderCell: (params) => (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <ActionCell {...params} />
      </div>
    ),
  },
];

// -------------------- Action Menu Cell --------------------
export const ActionCell = (params: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDelete = () => {
    dispatch(delUserFn(params.row.user_id));
    dispatch(resetDelUser());
    handleClose();
  };

  return (
    <div>
      <MoreVertIcon
        aria-label="more"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      />
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: { maxHeight: 48 * 4.5, width: "20ch" },
        }}
      >
        <Link
          to={`/Dashboard/User/Update/${params.row.user_id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem onClick={handleClose}>Update</MenuItem>
        </Link>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={() => console.log("More", params.row)}>More</MenuItem>
      </Menu>
    </div>
  );
};

// -------------------- Main Component --------------------
function UserData() {
  const navigate = useNavigate();
  const toastId = "deleteUser";

  const AllUserState = useSelector((state: RootState) => state.AllUsers);
  const DeleteUserState = useSelector((state: RootState) => state.Deluser);

  const dispatch = useDispatch<AppDispatch>();

  // Load users
  useEffect(() => {
    dispatch(GetAllUserCompnyFN());
  }, [dispatch]);

  // Handle delete state
  useEffect(() => {
    if (DeleteUserState.isLoading) toast.loading("Deleting user...", { id: toastId });
    if (DeleteUserState.isSuccess) {
      toast.success("User deleted successfully", { id: toastId });
      navigate("/Dashboard/User");
    }
    if (DeleteUserState.isError) {
      toast.error(DeleteUserState.errorMsg, { id: toastId });
    }
    dispatch(resetDelUser());
  }, [
    DeleteUserState.isLoading,
    DeleteUserState.isError,
    DeleteUserState.isSuccess,
    dispatch,
    navigate,
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box sx={{ flex: 1, width: "98%" }}>
        <DataGrid
          rows={AllUserState.data}
          getRowId={(row) => row.user_id} // 👈 FIX: use user_id as unique id
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#F5F5F5" },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#F9F9F9" },
          }}
        />
      </Box>
    </Box>
  );
}

export default UserData;

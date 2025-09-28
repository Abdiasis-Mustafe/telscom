import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { getAllPayableFn } from '@/Redux/Slice/GetAllPayableSlice';
import './PayablesTable.css';

const columns: GridColDef[] = [
  { field: 'vendor_name', headerName: 'Name', width: 300, },
  { field: 'vendor_phone', headerName: 'Phone', width: 150, },
  { field: 'vendor_address', headerName: 'Address', width: 200, },
  { field: 'product_name', headerName: 'Product Name', width: 150, },
  { field: 'purchase_qty', headerName: 'Quantity', width: 100, },
  { field: 'item_cost', headerName: 'Cost', width: 100, },
  { field: 'total_cost', headerName: 'Total Cost', width: 100, },
  { field: 'purchase_discount', headerName: 'Discount', width: 100, },
  { field: 'debt', headerName: 'Debt', width: 100, },
  {
    field: 'action',
    headerName: 'Action',
    width: 250,
    renderCell: (params) => (
      <div style={{ }}>
         <Link to={`/Dashboard/Payables/payment/${params.row.purchase_id}`}>
          <button className="bg-[#5b93ff] rounded-xl mt-2 items-center justify-center px-2 p-2 text-sm text-white">
            Pay Now
          </button>
        </Link>
      </div>
    ),
  },
];

export default function PayablesTable() {
  const dispatch = useDispatch<AppDispatch>();
  const GetAllPayable = useSelector((state: RootState) => state.AllPayable);

  useEffect(() => {
    dispatch(getAllPayableFn());
  }, [dispatch]);

  const rows = GetAllPayable.data.map((payable) => ({
    id: payable.purchase_id || `id-${Math.random().toString(36).substr(2, 9)}`,
    ...payable,
  }));

  return (
    <div>

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ flex: 1, width: '98%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          rowCount={rows.length}
          sx={{
            gap: "20px",
            // height: 'calc(100vh - 64px)',  // Adjusted for better height
            // "&.MuiDataGrid-root": {
            //   border: "none",
            //   backgroundColor: "white",
            //   boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            //   borderRadius: "10px",
            // },
            // "&.MuiDataGrid-root .MuiDataGrid-cell": {
            //   borderBottom: "none",
            //   padding: "12px 16px",
            //   fontSize: "14px",
            //   fontWeight: "normal",
            //   color: "#333333",
            // },
            // "&.MuiDataGrid-root .MuiDataGrid-row": {
            //   backgroundColor: "white",
            //   borderRadius: "10px",
            //   margin: "8px 0",
            // },
            // "&.MuiDataGrid-root .MuiDataGrid-columnHeaders": {
            //   backgroundColor: "white",
            //   padding: "12px 16px",
            //   fontSize: "14px",
            //   fontWeight: "bold",
            //   color: "#333333",
            // },
          }}
        />
      </Box>
    </Box>
    </div>
  );
}

// import  { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/Redux/Store';
// import { getAllReceiveAbleFn } from '@/Redux/Slice/ReceiveAbleSlice';
import './PayablesTable.css';

const columns: GridColDef[] = [
  { field: 'customer_name', headerName: 'Name', width: 200,  },
  { field: 'customer_phone', headerName: 'Phone', width: 200,  },
  { field: 'customer_address', headerName: 'Address', width: 200,  },
  { field: 'product_name', headerName: 'Product Name', width: 200,  },
  { field: 'sale_qty', headerName: 'Quantity', width: 100,  },
  
  { field: 'total_price', headerName: 'Total Price', width: 100,  },
  { field: 'received_amount', headerName: 'Received', width: 100,  },
  { field: 'credit', headerName: 'Dept', width: 100,  },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
   
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <Link to={`/Dashboard/Receiveable/RecieveAblepayment/${params.row.sale_id}`}>
        <button className="bg-[#5b93ff] rounded-xl mt-2 items-center justify-center px-2 p-2 text-sm text-white">
          Pay Now
        </button>
      </Link>
      </div>
    ),
  },
  // {
  //   field: 'action',
  //   headerName: 'Action',
  //   width: 150,
  //   ,
  //   renderCell: (params) => (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  //       <Link to="/payment">
  //         <button className="bg-[#5b93ff] m-2 rounded-xl mt-2 items-center justify-center px-2 p-2 text-sm text-white">
  //           Pay Now
  //         </button>
  //       </Link>
  //     </div>
  //   ),
  // },
];

export default function RecieveTable() {
  // const dispatch = useDispatch<AppDispatch>();
  // const ReceiveAbleState = useSelector((state: RootState) => state.AllReceive);

  // useEffect(() => {
  //   dispatch(getAllReceiveAbleFn());
  // }, [dispatch]);

  // const rows = ReceiveAbleState.data.map((receive, index) => ({
  //   id: receive.sale_id ?? index, // Ensure a unique id for each row
  //   ...receive
  // }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        <DataGrid
         
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20]}
          // rowCount={rows.length} // Control the number of rows rendered
          sx={{
            gap:"20px",
            height: 'calc(100vh )', // Adjust height based on the available space
            "&.MuiDataGrid-root": {
              border: "none",
              backgroundColor: "white",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
            },
            "&.MuiDataGrid-root .MuiDataGrid-cell": {
              borderBottom: "none",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "normal",
              color: "#333333",
            },
            "&.MuiDataGrid-root .MuiDataGrid-row": {
              backgroundColor: "white",
              borderRadius: "10px",
              margin: "8px 0",
            },
            "&.MuiDataGrid-root .MuiDataGrid-columnHeaders": {
              backgroundColor: "white",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333333",
            },
          }}
        />
      </Box>
    </Box>
  );
}

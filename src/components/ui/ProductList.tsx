import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';

import toast from 'react-hot-toast';
import { getAllProductsFn } from '@/Redux/Slice/getAllProductsSlice';
import { delProductFn, resetDelProducts } from '@/Redux/Slice/DeleteProductSlice';
import { Link } from 'react-router-dom';

const columns: GridColDef[] = [
  { field: 'product_code', headerName: 'Tracking no', width: 200 },
  { field: 'product_name', headerName: 'Product Name', width: 300 },
  { field: 'product_cost', headerName: 'Cost', width: 200, renderCell: (params) => `$${params.value}` },
  {
    field: 'product_price',
    headerName: 'Price',
    width: 150,
    renderCell: (params) => (
      <div
        style={{
          backgroundColor: '#c5f5ff',
          borderRadius: '16px',
          padding: '0px',
          marginTop: '13px',
          marginBottom: '13px',
          textAlign: 'center',
          color: '#07b7c4',
        }}
      >
        ${params.value}
      </div>
    ),
  },
  {
    field: 'product_alert_number',
    headerName: 'Alert no',
    width: 150,
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {params.value}
      </div>
    ),
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 100,
    renderCell: (params) => (
      <ActionCell {...params} />
    ),
  },
];

export const ActionCell = (params:any) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    const toastId = 'delete-product';
    dispatch(delProductFn(params.id));
    toast.loading('Deleting product...', { id: toastId });
    handleClose();
  };

  return (
    <div>
      <MoreVertIcon
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        <Link to={`/Dashboard/Products/Update/${params.row.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem onClick={() => console.log('Edit')}>Update</MenuItem>
        </Link>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={() => console.log('More')}>More</MenuItem>
      </Menu>
    </div>
  );
};

export default function ProductListdata() {
  const dispatch = useDispatch<AppDispatch>();
  const AllProductState = useSelector((state: RootState) => state.AllProduct);
  const DelProductsState = useSelector((state: RootState) => state.DelProducs);

  React.useEffect(() => {
    dispatch(getAllProductsFn());
  }, [dispatch]);

  React.useEffect(() => {
    const toastId = 'delete-product';
    if (DelProductsState.isLoading) {
      toast.loading('Deleting product...', { id: toastId });
    }
    if (DelProductsState.isSuccess) {
      toast.success('Product deleted successfully.', { id: toastId });
      dispatch(getAllProductsFn());
    }
    if (DelProductsState.isError) {
      toast.error(DelProductsState.errorMsg, { id: toastId });
    }
    dispatch(resetDelProducts());
  }, [DelProductsState.isLoading, DelProductsState.isError, DelProductsState.isSuccess, dispatch]);

  return (
    <Box
      className="w-full h-full border-none"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box className="flex-1 w-full">
        <DataGrid
          rows={AllProductState.data.map((product) => ({ id: product.product_id, ...product }))}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          sx={{
            paddingRight: '10px',
            paddingLeft: '10px',
          }}
        />
      </Box>
    </Box>
  );
}
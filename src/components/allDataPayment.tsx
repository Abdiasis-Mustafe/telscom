import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { getAllPaymentFn } from '@/Redux/Slice/companies/allpaymentslice';

import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { delPaymentFn, resetDelPayment } from '@/Redux/Slice/companies/DelpaymentSlice';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'company_name', headerName: 'Company Name', width: 200 },
  { field: 'amount_paid', headerName: 'Paid Amount', width: 120 },
  { field: 'months_covered', headerName: 'Covered Months', width: 150 },
  { field: 'expected_amount', headerName: 'Expected Amount', width: 150 },
  { field: 'subscribtion_fee', headerName: 'Subscription Fee', width: 160 },
  { field: 'debt', headerName: 'Debt', width: 120 },
  {
    field: 'start_date',
    headerName: 'Start Date',
    width: 150,
    valueFormatter: (params) => format(new Date(params), 'yyyy-MM-dd') 
  },
  {
    field: 'end_date',
    headerName: 'End Date',
    width: 150,
    valueFormatter: (params) => format(new Date(params), 'yyyy-MM-dd') 
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
      const endDate = new Date(params.row.end_date);
      const today = new Date();
      const isOverdue = today >= endDate;
      
      return (
        <div style={{ 
          backgroundColor: isOverdue ? '#ffcccc' : '#ccffcc',
          color: isOverdue ? '#990000' : '#006600',
          padding: '4px 8px',
          borderRadius: '4px',
          fontWeight: 'bold',
          width: '80%',
          textAlign: 'center'
        }}>
          {isOverdue ? 'Overdue' : 'Active'}
        </div>
      );
    },
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 100,
    renderCell: (params) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ActionCell {...params} />
      </div>
    ),
  },
];

export const ActionCell = (params: any) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(delPaymentFn({ 
      id: params.row.id, 
      company_id: params.row.company_id 
    }));
    dispatch(resetDelPayment());
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
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 48 * 4.5, width: '20ch' } }}
      >
        <Link
          to={`/Dashboard/Payment/All/Update/${params.row.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <MenuItem>Update</MenuItem>
        </Link>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem>More</MenuItem>
      </Menu>
    </div>
  );
};

export default function DataPaments() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 20,
  });
  const toastId = "vendor del";
  const AllpaymentState = useSelector((state: RootState) => state.AllPayment);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(getAllPaymentFn({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize
    }));
  }, [dispatch, paginationModel]);

  const DelPaymentState = useSelector((state: RootState) => state.DelPayment);

  React.useEffect(() => {
    if (DelPaymentState.isLoading) toast.loading('Deleting!', { id: toastId });
    if (DelPaymentState.isSuccess) {
      toast.success('Company deleted', { id: toastId });
      navigate('/Dashboard/Payment');
    }
    if (DelPaymentState.isError) {
      toast.error(DelPaymentState.errorMsg, { id: toastId });
    }
    dispatch(resetDelPayment());
  }, [DelPaymentState.isLoading, DelPaymentState.isError, DelPaymentState.isSuccess, dispatch, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, width: '98%' }}>
        <DataGrid
          rows={AllpaymentState.data.map((payment: any) => ({
            id: payment.id,
            ...payment,
            company_id: payment.company?.company_id,
            company_name: payment.company?.company_name,
            subscribtion_fee: payment.company?.subscribtion_fee,
            debt: payment.company?.debt,
          }))}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[20, 30, 50]}
          rowCount={AllpaymentState.total}
          paginationMode="server"
          sx={{ padding: '0 10px' }}
        />
      </Box>
    </Box>
  );
}
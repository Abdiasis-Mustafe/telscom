// Import necessary modules
import { AppDispatch, RootState } from "@/Redux/Store";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getAllExpensesOnlyFn } from "@/Redux/Slice/expenses/AllExpensesSlice";
import { delExpensesFn, resetExpensesDelete } from "@/Redux/Slice/expenses/DeleteExpensesSlice";

// Define columns for the DataGrid
const columns: GridColDef[] = [
    { field: 'expense_id', headerName: 'Id', width: 100 },
    { field: 'item_name', headerName: 'Item name', width: 200 },
    { field: 'item_qty', headerName: 'Quantity', width: 200 },
    { field: 'item_cost', headerName: 'Item Cost', width: 200 },
    { field: 'total_cost', headerName: 'Total Cost', width: 200 },
    { field: 'paid_amount', headerName: 'Paid Amount', width: 300 },
    { field: 'date', headerName: 'Date', width: 200, 
        valueFormatter: (params) => format(new Date(params), 'yyyy-MM-dd') 
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 100,
        renderCell: (params) => <ActionCell {...params} />,
    },
];

// ActionCell component for row actions (update/delete)
export const ActionCell = (params: any) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch<AppDispatch>();

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        dispatch(delExpensesFn(params.row.expense_id));
        dispatch(resetExpensesDelete());
        handleClose();
        window.location.reload();
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
                PaperProps={{
                    style: { maxHeight: 48 * 4.5, width: '20ch' },
                }}
            >
                <Link to={`/Dashboard/Products/Expenses/Update/${params.row.expense_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem>Update</MenuItem>
                </Link>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                <MenuItem>More</MenuItem>
            </Menu>
        </div>
    );
};

// Main ExpensesData component
function ExpensesData() {
    const navigate = useNavigate();
    const toastId = "deleteVendor";
    const dispatch = useDispatch<AppDispatch>();

    const AllExpensesState = useSelector((state: RootState) => state.GetAllExpensesOnly);
    const DeleteExpensestate = useSelector((state: RootState) => state.DelExpenses);

    useEffect(() => {
        dispatch(getAllExpensesOnlyFn());
    }, [dispatch]);

    useEffect(() => {
        if (DeleteExpensestate.isLoading) toast.loading('Deleting!', { id: toastId });
        if (DeleteExpensestate.isSuccess) {
            toast.success('Expenses is deleted.', { id: toastId });
            navigate('/Dashboard/Products/Expenses');
        }
        if (DeleteExpensestate.isError) {
            toast.error(DeleteExpensestate.errorMsg, { id: toastId });
        }
        dispatch(resetExpensesDelete());
    }, [DeleteExpensestate, dispatch, navigate]);

    // Calculate total_cost outside columns definition
    const rows = AllExpensesState.data.map((expenses) => ({
        id: expenses.expense_id,
        expense_id: expenses.expense_id,
        item_name: expenses.item_name,
        item_qty: expenses.item_qty,
        date: expenses.date,
        paid_amount: expenses.paid_amount,
        item_cost: expenses.item_cost,
        total_cost: parseFloat(expenses.item_cost) * expenses.item_qty,
        created_at: expenses.created_at,
        updated_at: expenses.updated_at,
    }));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, width: '98%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10]}
                    sx={{ gap: '20px' }}
                />
            </Box>
        </Box>
    );
}

export default ExpensesData;

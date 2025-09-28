import { getAllSalariesFn } from "@/Redux/Slice/Salareis/AllSalarySlice";
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
import { delSalaryFn, resetSalaryDelete } from "@/Redux/Slice/Salareis/DeleteSalaryslice";

const columns: GridColDef[] = [
    { field: 'salary_id', headerName: 'Id', width: 100 },
    { field: 'paid_amount', headerName: 'Paid Amount', width: 200 },
    { field: 'date', headerName: 'Date', width: 200, 
        valueFormatter: (params) => format(new Date(params), 'yyyy-MM-dd') 
      },
    { field: 'employee_name', headerName: 'Name', width: 200 },
    { field: 'employee_address', headerName: 'Address', width: 300 },
    { field: 'employee_phone', headerName: 'Phone number', width: 200 },
    { field: 'salary_amount', headerName: 'Salary', width: 200 },
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
        dispatch(delSalaryFn(params.row.salary_id));
        dispatch(resetSalaryDelete());
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
                <Link to={`/Dashboard/Employees/salaries/update/${params.row.salary_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem>Update</MenuItem>
                </Link>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                <MenuItem>More</MenuItem>
            </Menu>
        </div>
    );
};

function SalariesData() {
    const navigate = useNavigate();
    const toastId = "deleteVendor";
    const AllSalariesState = useSelector((state: RootState) => state.AllSalaries);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllSalariesFn());
    }, [dispatch]);

    const DeleteSalaryState = useSelector((state: RootState) => state.DeleteSalary);

    useEffect(() => {
        if (DeleteSalaryState.isLoading) toast.loading('Deleting!', { id: toastId });
        if (DeleteSalaryState.isSuccess) {
            toast.success('Salary is deleted.', { id: toastId });
            navigate('/Dashboard/Employees');
        }
        if (DeleteSalaryState.isError) {
            toast.error(DeleteSalaryState.errorMsg, { id: toastId });
        }
        dispatch(resetSalaryDelete());
    }, [DeleteSalaryState.isLoading, DeleteSalaryState.isError, DeleteSalaryState.isSuccess, dispatch, navigate]);

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
                        rows={AllSalariesState.data.map((salary) => ({
                            id: salary.salary_id,
                            salary_id: salary.salary_id,
                            paid_amount: salary.paid_amount,
                            date: salary.date,
                            employee_name: salary.employees.employee_name,
                            employee_address: salary.employees.employee_address,
                            employee_phone: salary.employees.employee_phone,
                            salary_amount: salary.employees.salary_amount,
                        }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        sx={{
                            gap: '20px',
                        }}
                    />
                </Box>
            </Box>
        </div>
    );
}

export default SalariesData;

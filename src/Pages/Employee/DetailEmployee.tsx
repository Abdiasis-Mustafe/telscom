import React, { useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/Redux/Store";
import {
  getSingleEmployeeReport,
  resetEmployeeReport,
} from "@/Redux/Slice/Employe/OneEmplaymentSlice";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";

export default function EmployeeReportPage() {
  const { report_id } = useParams<{ report_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { byId, isLoading, isError, errorMsg } = useSelector(
    (state: RootState) => state.employeeReport
  );

  const reportId = Number(report_id);
  const report = byId[reportId];

  useEffect(() => {
    if (reportId) {
      dispatch(getSingleEmployeeReport(reportId));
    }

    return () => {
      dispatch(resetEmployeeReport());
    };
  }, [dispatch, reportId]);

  if (isLoading) return <Typography align="center">Loading...</Typography>;
  if (isError) return <Typography color="error">{errorMsg}</Typography>;
  if (!report) return <Typography align="center">No report found.</Typography>;

  const totalEmployees = report.new_employees - report.left_employees;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Top Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <SideParsm />
        <Nav />
      </Box>

      {/* Card Wrapper */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Employee Report Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Box>

        {/* Report Info */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Company
              </Typography>
              <Typography fontWeight="bold">
                {report.company?.company_name || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Month/Year
              </Typography>
              <Typography fontWeight="bold">
                {report.month}/{report.year}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Avg Performance
              </Typography>
              <Typography fontWeight="bold">
                {report.avg_performance || "N/A"}%
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography fontWeight="bold">
                {new Date(report.created_at).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Metrics Table */}
        <Box sx={{ p: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Metric
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">New Employees</TableCell>
                <TableCell align="center">{report.new_employees}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Left Employees</TableCell>
                <TableCell align="center">{report.left_employees}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Deaths</TableCell>
                <TableCell align="center">{report.death}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Serious Illness</TableCell>
                <TableCell align="center">{report.serious_illness}</TableCell>
              </TableRow>
              {/* <TableRow sx={{ backgroundColor: "#f1f5ff" }}>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Total Employees
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {totalEmployees}
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </Box>

        <Divider />

        {/* Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ p: 3, justifyContent: "flex-end" }}
        >
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back to List
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() =>
              navigate(`/employee-report/edit/${report.report_id}`)
            }
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              console.log("Delete report", report.report_id)
            }
          >
            Delete
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

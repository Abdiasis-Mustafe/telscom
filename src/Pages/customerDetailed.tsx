import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  CircularProgress,
  Button,
  Chip,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import {
  GetSingleCustomerFn,
  resetSingleCustomer,
} from "@/Redux/Slice/customerReportSlice/SingleCustomerReport";
import { SingleServiceFN } from "@/Redux/Slice/Services/singleServiceSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Users, Target } from "lucide-react";

// Custom components for better organization
const StatCard = ({ title, value, subtitle, trend, color }: any) => (
  <Card sx={{ 
    p: 3, 
    borderRadius: 4, 
    background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
    border: `1px solid ${color}20`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 25px ${color}15`,
    }
  }}>
    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
        {trend && (
          <Chip 
            icon={trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            label={`${trend > 0 ? '+' : ''}${trend}%`}
            size="small"
            color={trend > 0 ? 'success' : 'error'}
            variant="outlined"
          />
        )}
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography 
            key={index} 
            variant="body2" 
            sx={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const printRef = useRef();

  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.SingleCustomerR
  );
  const services = useSelector((state: RootState) => state.Oneservice.byId);

  useEffect(() => {
    if (id) {
      dispatch(GetSingleCustomerFn(Number(id)));
    }
    return () => {
      dispatch(resetSingleCustomer());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (data?.metrics) {
      data.metrics.forEach((m: any) => {
        if (!services[m.service_id]) {
          dispatch(SingleServiceFN(m.service_id));
        }
      });
    }
  }, [data, services, dispatch]);

  // Color palette
  const colors = {
    primary: theme.palette.primary.main,
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
  };

  if (isLoading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      flexDirection: 'column',
      gap: 2
    }}>
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        Generating Report...
      </Typography>
    </Box>
  );

  if (error) return (
    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: alpha(colors.error, 0.05) }}>
      <Typography color="error" variant="h6">
        Error Loading Report
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {error}
      </Typography>
    </Paper>
  );

  if (!data) return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6">No record found</Typography>
    </Paper>
  );

  // Prepare chart data
  const metricsData = data.metrics.map((m: any) => ({
    name: services[m.service_id]?.name || `Service ${m.service_id}`,
    Active: m.active_users,
    Target: m.target_value,
    Utilization: Math.round((m.active_users / m.target_value) * 100)
  }));

  const churnData = [
    { name: "Churned", value: data.churn_rate, color: colors.error },
    { name: "Retained", value: 100 - data.churn_rate, color: colors.success }
  ];

  const performanceData = metricsData.map((item, index) => ({
    ...item,
    fill: index % 2 === 0 ? colors.primary : colors.info
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Printable Report Container */}
      <Box ref={printRef} sx={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        '@media print': {
          bgcolor: 'white',
          p: 0,
          '& .no-print': { display: 'none' }
        }
      }}>
        
        {/* Header Section */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 4,
          background: colors.gradient,
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Customer Analytics Report
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Comprehensive overview of customer performance and metrics
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Chip 
                label={`${data.year}-${String(data.month).padStart(2, "0")}`}
                sx={{ 
                  bgcolor: 'white', 
                  color: colors.primary, 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  p: 1
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Report ID: {data.id}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Action Bar */}
        <Box sx={{ mb: 4 }} className="no-print">
          <Button
            variant="contained"
            startIcon={<Target size={20} />}
            onClick={() => window.print()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: colors.gradient,
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              }
            }}
          >
            Export Report
          </Button>
        </Box>

        {/* Key Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Customers"
              value={data.total_customers?.toLocaleString()}
              subtitle="Current active customers"
              trend={data.growth_rate}
              color={colors.primary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Growth Rate"
              value={`${data.growth_rate}%`}
              subtitle="Monthly growth"
              trend={data.growth_rate}
              color={colors.success}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Churn Rate"
              value={`${data.churn_rate}%`}
              subtitle="Customer attrition"
              trend={-data.churn_rate}
              color={colors.error}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Retention Rate"
              value={`${100 - data.churn_rate}%`}
              subtitle="Customer retention"
              trend={100 - data.churn_rate}
              color={colors.info}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Performance Chart */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Service Performance Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={performanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="Active" 
                      fill={colors.primary}
                      radius={[4, 4, 0, 0]}
                      name="Active Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Target" 
                      stroke={colors.warning}
                      strokeWidth={3}
                      dot={{ fill: colors.warning, strokeWidth: 2 }}
                      name="Target Value"
                    />
                    <Area 
                      dataKey="Utilization" 
                      fill={alpha(colors.info, 0.3)}
                      stroke={colors.info}
                      name="Utilization %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Retention Pie Chart */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Customer Retention
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={churnData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {churnData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  <Chip label="Healthy Retention" color="success" variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Service Metrics */}
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              Service Metrics Breakdown
            </Typography>
            <Grid container spacing={3}>
              {data.metrics.map((m: any, index: number) => {
                const service = services[m.service_id];
                const utilization = Math.round((m.active_users / m.target_value) * 100);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={m.service_id}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: colors.primary,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: index % 2 === 0 ? colors.primary : colors.info,
                          mr: 1.5
                        }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {service?.name || `Service ${m.service_id}`}
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Active Users
                          </Typography>
                          <Typography variant="h6" color={colors.primary}>
                            {m.active_users}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Target
                          </Typography>
                          <Typography variant="h6">
                            {m.target_value}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Utilization: {utilization}%
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          height: 6, 
                          bgcolor: theme.palette.grey[200],
                          borderRadius: 3,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            width: `${Math.min(utilization, 100)}%`, 
                            height: '100%',
                            background: utilization >= 80 ? colors.success : 
                                       utilization >= 60 ? colors.warning : colors.error,
                            borderRadius: 3
                          }} />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 6, textAlign: 'center', color: 'text.secondary' }} className="no-print">
          <Typography variant="body2">
            Report generated on {new Date().toLocaleDateString()} • Confidential Business Data
          </Typography>
        </Box>
      </Box>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page { margin: 1cm; size: portrait; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          .MuiPaper-root { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
      `}</style>
    </Box>
  );
}
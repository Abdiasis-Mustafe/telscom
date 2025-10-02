import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import { fetchTechnicalReport, clearError } from "@/Redux/Slice/technical/TechnicalSlice";
import Nav from "@/components/Nav";
import SideParsm from "@/components/SideParsm";
import { 
  ArrowLeft, 
  Calendar, 
  Building, 
  Target, 
  AlertTriangle,
  Download,
  Share2,
  Edit,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  PieChart,
  BarChart3
} from "lucide-react";
import toast from "react-hot-toast";

// Modern PDF Components
import { 
  PDFDownloadLink, 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  Link
} from '@react-pdf/renderer';

// Register fonts (optional - for better typography)
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2',
      fontWeight: 'bold',
    },
  ],
});

// PDF Styles
// PDF Styles - FIXED VERSION
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica', // Use default font
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Changed to black
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#000000', // Changed to black
    textAlign: 'center',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Changed to black
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gridItem: {
    width: '48%',
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderLeft: '4px solid #3b82f6',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000', // Changed to black
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: '#000000', // Changed to black
    fontWeight: 'bold',
  },
  achievementCard: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeft: '4px solid #10b981',
  },
  challengeCard: {
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeft: '4px solid #f59e0b',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000', // Changed to black
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 12,
    color: '#000000', // Changed to black
    lineHeight: 1.4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000', // Changed to black
  },
  statLabel: {
    fontSize: 12,
    color: '#000000', // Changed to black
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1px solid #e5e7eb',
    fontSize: 10,
    color: '#000000', // Changed to black
    textAlign: 'center',
  },
});

// PDF Document Component - FIXED VERSION
const TechnicalReportPDF = ({ report }: { report: any }) => {
  const getMonthName = (monthNumber: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1] || "Unknown Month";
  };

  const achievementsCount = report?.achievements?.length || 0;
  const challengesCount = report?.challenges?.length || 0;
  const totalItems = achievementsCount + challengesCount;
  const achievementPercentage = totalItems > 0 ? Math.round((achievementsCount / totalItems) * 100) : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Technical Performance Report</Text>
          <Text style={styles.subtitle}>
            {getMonthName(report.month)} {report.year} • {report.company?.company_name || "N/A"}
          </Text>
          <Text style={styles.subtitle}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Report Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Overview</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Period</Text>
                <Text style={styles.cardValue}>
                  {getMonthName(report.month)} {report.year}
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Company</Text>
                <Text style={styles.cardValue}>
                  {report.company?.company_name || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Created Date</Text>
                <Text style={styles.cardValue}>
                  {report.created_at 
                    ? new Date(report.created_at).toLocaleDateString()
                    : 'N/A'
                  }
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Status</Text>
                <Text style={styles.cardValue}>Completed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
              <Text style={styles.statCount}>
                {achievementsCount}
              </Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#fffbeb' }]}>
              <Text style={styles.statCount}>
                {challengesCount}
              </Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Success Rate</Text>
            <Text style={styles.cardValue}>
              {achievementPercentage}% Positive Ratio
            </Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Achievements ({achievementsCount})
          </Text>
          {report.achievements && report.achievements.length > 0 ? (
            report.achievements.map((achievement: any, index: number) => (
              <View key={index} style={styles.achievementCard}>
                <Text style={styles.itemTitle}>✓ {achievement.title}</Text>
                {achievement.description && (
                  <Text style={styles.itemDescription}>
                    {achievement.description}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.card}>
              <Text style={styles.itemDescription}>
                No achievements recorded for this period
              </Text>
            </View>
          )}
        </View>

        {/* Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Challenges ({challengesCount})
          </Text>
          {report.challenges && report.challenges.length > 0 ? (
            report.challenges.map((challenge: any, index: number) => (
              <View key={index} style={styles.challengeCard}>
                <Text style={styles.itemTitle}>⚠ {challenge.title}</Text>
                {challenge.description && (
                  <Text style={styles.itemDescription}>
                    {challenge.description}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.card}>
              <Text style={styles.itemDescription}>
                No challenges recorded for this period
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Report ID: #{report.id} • Company ID: {report.company_id}</Text>
          <Text>Generated by Technical Reports System</Text>
        </View>
      </Page>
    </Document>
  );
};

// Simple Chart Components (keep existing)
const ProgressRing = ({ progress, color, size = 80 }: { progress: number; color: string; size?: number }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${color}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${color.replace('text-', 'text-')}`}>
          {progress}%
        </span>
      </div>
    </div>
  );
};

const SimpleBarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3 group">
          <div className="w-20 text-sm text-gray-600">{item.label}</div>
          <div className="flex-1">
            <div className="relative">
              <div 
                className={`h-6 rounded-full transition-all duration-1000 ease-out ${item.color} group-hover:scale-105`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  maxWidth: '100%'
                }}
              ></div>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-700">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;
  
  return (
    <div className="relative" style={{ width: 120, height: 120 }}>
      <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const startAngle = (accumulated / total) * 360;
          accumulated += item.value;
          const endAngle = (accumulated / total) * 360;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = 60 + 40 * Math.cos(startRad);
          const y1 = 60 + 40 * Math.sin(startRad);
          const x2 = 60 + 40 * Math.cos(endRad);
          const y2 = 60 + 40 * Math.sin(endRad);
          
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;
          
          return (
            <path
              key={index}
              d={`M 60 60 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
              className="transition-all duration-1000 ease-out opacity-80 hover:opacity-100"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

function ViewTechnicalReport() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isVisible, setIsVisible] = useState(false);
  
  const { 
    singleReport, 
    isLoading, 
    isError, 
    errorMsg 
  } = useSelector((state: RootState) => state.Technical);

  useEffect(() => {
    if (id) {
      dispatch(fetchTechnicalReport(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (singleReport && !isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [singleReport, isLoading]);

  useEffect(() => {
    if (isError) {
      toast.error(errorMsg);
      dispatch(clearError());
    }
  }, [isError, errorMsg, dispatch]);

  const handleEdit = () => {
    if (singleReport?.id) {
      navigate(`/dashboard/Technical/update/${singleReport.id}`);
    }
  };

  const handleShare = () => {
    toast.success("Share feature coming soon!");
  };

  const getMonthName = (monthNumber: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1] || "Unknown Month";
  };

  // Calculate chart data
  const achievementsCount = singleReport?.achievements?.length || 0;
  const challengesCount = singleReport?.challenges?.length || 0;
  const totalItems = achievementsCount + challengesCount;
  const achievementPercentage = totalItems > 0 ? Math.round((achievementsCount / totalItems) * 100) : 0;
  
  const barChartData = [
    { label: "Achievements", value: achievementsCount, color: "bg-green-500" },
    { label: "Challenges", value: challengesCount, color: "bg-orange-500" }
  ];
  
  const donutChartData = [
    { label: "Achievements", value: achievementsCount, color: "#10B981" },
    { label: "Challenges", value: challengesCount, color: "#F59E0B" }
  ];

  // Generate PDF filename
  const getPDFFileName = () => {
    if (!singleReport) return "technical_report.pdf";
    const companyName = (singleReport as any).company?.company_name?.replace(/\s+/g, '_') || 'Report';
    return `Technical_Report_${companyName}_${getMonthName(singleReport.month)}_${singleReport.year}.pdf`;
  };

  // Loading skeleton
  if (isLoading && !singleReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="flex justify-between items-center mb-8">
          <SideParsm />
          <Nav />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!singleReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="flex justify-between items-center mb-8">
          <SideParsm />
          <Nav />
        </div>
        
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="animate-bounce mb-6">
            <FileText className="h-20 w-20 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-light text-gray-700 mb-3">Report Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The technical report you're looking for doesn't exist or may have been moved.
          </p>
          <button
            onClick={() => navigate("/technical-reports")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <SideParsm />
        <Nav />
      </div>

      <div className={`max-w-6xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/technical-reports")}
              className="group p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </button>
            <div>
              <h1 className="text-2xl font-light text-gray-800 mb-1">
                Technical Report
              </h1>
              <p className="text-gray-500 text-sm">
                {getMonthName(singleReport.month)} {singleReport.year} • {(singleReport as any).company?.company_name || "N/A"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-medium text-gray-800">Report Overview</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Period</p>
                      <p className="font-medium text-gray-800">
                        {getMonthName(singleReport.month)} {singleReport.year}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Building className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-gray-800">
                        {(singleReport as any).company?.company_name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium text-gray-800 text-sm">
                        {singleReport.created_at 
                          ? new Date(singleReport.created_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-gray-800">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-800">Achievements</h2>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    {singleReport.achievements?.length || 0}
                  </span>
                </div>
              </div>

              {singleReport.achievements && singleReport.achievements.length > 0 ? (
                <div className="space-y-4">
                  {singleReport.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="group p-4 bg-green-50/50 rounded-xl border border-green-100 transition-all duration-300 hover:bg-green-50 hover:border-green-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                            {achievement.title}
                          </h3>
                          {achievement.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {achievement.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>No achievements recorded</p>
                </div>
              )}
            </div>

            {/* Challenges */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-800">Challenges</h2>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                    {singleReport.challenges?.length || 0}
                  </span>
                </div>
              </div>

              {singleReport.challenges && singleReport.challenges.length > 0 ? (
                <div className="space-y-4">
                  {singleReport.challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="group p-4 bg-orange-50/50 rounded-xl border border-orange-100 transition-all duration-300 hover:bg-orange-50 hover:border-orange-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-2 group-hover:text-orange-700 transition-colors">
                            {challenge.title}
                          </h3>
                          {challenge.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {challenge.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>No challenges recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-800">Progress Overview</h3>
              </div>
              
              <div className="space-y-6">
                {/* Achievement Progress Ring */}
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <ProgressRing 
                      progress={achievementPercentage} 
                      color="text-green-500" 
                      size={100}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Positive Ratio</p>
                  <p className="text-lg font-bold text-gray-800">
                    {achievementPercentage}% Achievements
                  </p>
                </div>

                {/* Bar Chart */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-medium text-gray-700">Items Comparison</h4>
                  </div>
                  <SimpleBarChart data={barChartData} />
                </div>

                {/* Donut Chart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-medium text-gray-700">Distribution</h4>
                  </div>
                  <DonutChart data={donutChartData} />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                  <span className="text-sm text-gray-600">Achievements</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                    {singleReport.achievements?.length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-xl">
                  <span className="text-sm text-gray-600">Challenges</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
                    {singleReport.challenges?.length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Report ID</span>
                  <span className="text-sm font-mono text-gray-700">
                    #{singleReport.id}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium text-green-700">
                    {achievementPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleEdit}
                  className="w-full flex items-center gap-3 p-3 text-left bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <Edit className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700">Edit Report</span>
                </button>
                
                {/* Modern PDF Download Link */}
                {singleReport && (
                  <PDFDownloadLink
                    document={<TechnicalReportPDF report={singleReport} />}
                    fileName={getPDFFileName()}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] group no-underline"
                    onClick={() => toast.success("Generating PDF...")}
                  >
                    {({ loading }) => (
                      <>
                        <Download className="h-4 w-4 text-gray-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-gray-700">
                          {loading ? "Generating PDF..." : "Export PDF"}
                        </span>
                      </>
                    )}
                  </PDFDownloadLink>
                )}
                
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <Share2 className="h-4 w-4 text-gray-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700">Share Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTechnicalReport;
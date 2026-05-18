import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiDollarSign,
  FiUser,
  FiScissors,
  FiCalendar,
  FiTrendingUp,
  FiShoppingBag,
  FiUsers,
  FiActivity,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OwnerReports = ({
  servicesCount = 0,
  productsCount = 0,
  staffCount = 0,
}) => {
  const owner = JSON.parse(localStorage.getItem("owner"));
  const ownerId = owner?._id;

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalServices: servicesCount,
    totalProducts: productsCount,
    totalStaff: staffCount,
    totalAppointments: 0,
    totalEarning: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportAnalytics = async () => {
      if (!ownerId) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/owner/dashboard-stats/${ownerId}`,
        );

        if (response.data && response.data.success) {
          const apiCards = response.data.cards;

          // Saare short months ka ek fixed master template loop order map karenge
          const allMonthsOrder = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          // API data ko easy cross-reference karne ke liye object map me badlenge
          const apiDataMap = {};
          if (Array.isArray(response.data.growthData)) {
            response.data.growthData.forEach((item) => {
              apiDataMap[item.month] = item.count;
            });
          }

          // 🔥 FIXED LOGIC: Poore 12 mahino ko backfill karenge empty nodes ko 0 dekar
          const filledChartData = allMonthsOrder.map((m) => ({
            month: m,
            count: apiDataMap[m] || 0,
          }));

          setStats({
            totalCustomers: apiCards.totalCustomers,
            totalServices: apiCards.totalServices || servicesCount,
            totalProducts: apiCards.totalProducts || productsCount,
            totalStaff: apiCards.totalStaff || staffCount,
            totalAppointments: apiCards.totalAppointments,
            totalEarning: apiCards.totalEarning,
          });

          setChartData(filledChartData);
        }
      } catch (error) {
        console.error(
          "Failed loading analytical reporting engine metrics:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReportAnalytics();
  }, [ownerId, servicesCount, productsCount, staffCount]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#d4af37",
          fontSize: "1.2rem",
          fontWeight: "600",
        }}
      >
        <p>Analyzing financial nodes & compiling reports...</p>
      </div>
    );
  }

  // Generate dynamic earning mapping strictly cross-syncing across full 12 months array layer
  const revenueGrowthChartData = chartData.map((item) => {
    const estimationFactor =
      stats.totalAppointments > 0
        ? stats.totalEarning / stats.totalAppointments
        : 0;
    return {
      month: item.month,
      earning: item.count > 0 ? Math.round(item.count * estimationFactor) : 0,
    };
  });

  return (
    <div
      className="od-section"
      style={{ animation: "fadeInUp 0.6s ease forwards" }}
    >
      <div className="od-section-header">
        <h2 className="od-section-title">Reports & Business Analytics</h2>
      </div>

      {/* Dynamic Upper Metrics Analytics Grid */}
      <div className="od-stats-grid">
        <div className="od-stat-card">
          <div className="od-stat-icon">
            <FiDollarSign />
          </div>
          <div className="od-stat-value">
            ₹{stats.totalEarning.toLocaleString("en-IN")}
          </div>
          <div className="od-stat-label">Total Earning</div>
        </div>

        <div className="od-stat-card">
          <div className="od-stat-icon">
            <FiUser />
          </div>
          <div className="od-stat-value">{stats.totalCustomers}</div>
          <div className="od-stat-label">Total Customer</div>
        </div>

        <div className="od-stat-card">
          <div className="od-stat-icon">
            <FiCalendar />
          </div>
          <div className="od-stat-value">{stats.totalAppointments}</div>
          <div className="od-stat-label">Total Appointments</div>
        </div>

        <div className="od-stat-card">
          <div className="od-stat-icon">
            <FiScissors />
          </div>
          <div className="od-stat-value">{stats.totalServices}</div>
          <div className="od-stat-label">Total Services</div>
        </div>
      </div>

      {/* Lower Secondary Resource Grid mapping */}
      <div className="od-stats-grid" style={{ marginBottom: "40px" }}>
        <div className="od-stat-card">
          <div
            className="od-stat-icon"
            style={{
              background: "rgba(183, 110, 121, 0.15)",
              color: "#b76e79",
            }}
          >
            <FiShoppingBag />
          </div>
          <div className="od-stat-value">{stats.totalProducts}</div>
          <div className="od-stat-label">Total Product</div>
        </div>

        <div className="od-stat-card">
          <div
            className="od-stat-icon"
            style={{ background: "rgba(128, 0, 32, 0.15)", color: "#800020" }}
          >
            <FiUsers />
          </div>
          <div className="od-stat-value">{stats.totalStaff}</div>
          <div className="od-stat-label">Total Staff</div>
        </div>
      </div>

      {/* --- GRAPH 1: FULL 12-MONTHS APPOINTMENT GROWTH GRAPH --- */}
      <div className="mb-5">
        <div className="od-section-header">
          <h3 className="od-section-title" style={{ fontSize: "19px" }}>
            Appointment Growth Distribution
          </h3>
        </div>
        <div
          className="od-card"
          style={{
            padding: "30px 25px 15px 10px",
            background: "#ffffff",
            height: "350px",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="luxuryGoldGlow"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#b76e79" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666666", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#eeeeee" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#666666", fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #d4af37",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                  itemStyle={{ color: "#d4af37" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Appointments"
                  stroke="#d4af37"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#luxuryGoldGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- GRAPH 2: FULL 12-MONTHS EARNING REVENUE GROWTH TIMELINE --- */}
      <div className="mb-4">
        <div className="od-section-header">
          <h3 className="od-section-title" style={{ fontSize: "19px" }}>
            <FiActivity className="me-2" style={{ color: "var(--burgundy)" }} />
            Earning Growth Distribution
          </h3>
        </div>
        <div
          className="od-card"
          style={{
            padding: "30px 25px 15px 10px",
            background: "#ffffff",
            height: "350px",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer>
              <AreaChart
                data={revenueGrowthChartData}
                margin={{ top: 10, right: 30, left: 15, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="luxuryBurgundyGlow"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#800020" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666666", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#eeeeee" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#666666", fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  unit="₹"
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #800020",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                  itemStyle={{ color: "#b76e79" }}
                  formatter={(value) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Revenue Earnings",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="earning"
                  name="Earning Growth"
                  stroke="#800020"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#luxuryBurgundyGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerReports;

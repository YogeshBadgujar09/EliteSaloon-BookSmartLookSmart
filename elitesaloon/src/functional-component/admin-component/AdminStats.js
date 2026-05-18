import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiUsers,
  FiShoppingBag,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiUserX,
} from "react-icons/fi";
import axios from "axios";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/admin/dashboard-stats",
        );
        if (res.data.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3 fw-bold">Loading Stats...</span>
      </div>
    );

  const { cards, growthData } = stats;

  // Chart Colors based on Bootstrap Primary Palette
  const COLORS = {
    primary: "#0d6efd", // Blue
    success: "#198754", // Green
    warning: "#ffc107", // Yellow
    info: "#0dcaf0", // Cyan
    danger: "#dc3545", // Red
    secondary: "#6c757d", // Grey
  };

  // 🔥 CHANGED: Labels and Colors updated to match Approve, Pending, Deactive using exact layout palette
  const approvalData = [
    { name: "Approve", value: cards.activeOwners, color: COLORS.success },
    { name: "Pending", value: cards.pendingOwners, color: COLORS.warning },
    {
      name: "Deactive",
      value: cards.totalOwners - cards.activeOwners - cards.pendingOwners,
      color: COLORS.danger,
    },
  ];

  return (
    <div
      className="container-fluid p-4"
      style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}
    >
      {/* --- TOP ROW: KPI CARDS --- */}
      <div className="row g-4 mb-4">
        <StatCard
          title="Total Customers"
          value={cards.totalCustomers}
          icon={<FiUsers />}
          color="primary"
          footerText={`${cards.activeCustomers} Active Status`}
        />
        <StatCard
          title="Total Owners"
          value={cards.totalOwners}
          icon={<FiShoppingBag />}
          color="success"
          footerText={`${cards.pendingOwners} Pending Approval`}
        />
        <StatCard
          title="Appointments"
          value={cards.totalAppointments}
          icon={<FiCalendar />}
          color="info"
          footerText="Total Bookings Done"
        />
        {/* 🔥 CHANGED: Label updated to Total Earning */}
        <StatCard
          title="Total Earning"
          value={`₹${cards.totalRevenue.toLocaleString()}`}
          icon={<FiDollarSign />}
          color="warning"
          footerText="Gross Revenue"
        />
      </div>

      <div className="row g-4 mb-4">
        {/* --- GROWTH CHART --- */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm p-4 h-100"
            style={{ borderRadius: "15px" }}
          >
            <h6 className="fw-bold mb-4 text-muted small text-uppercase letter-spacing-1">
              <FiActivity className="me-2 text-primary" />
              Monthly Registration Growth
            </h6>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={COLORS.primary}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- PIE CHART --- */}
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm p-4 h-100"
            style={{ borderRadius: "15px" }}
          >
            <h6 className="fw-bold mb-4 text-center text-muted small text-uppercase">
              Owner Approval Status
            </h6>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={approvalData}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={5}
                    stroke="none"
                  >
                    {approvalData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: ANALYSIS --- */}
      <div className="row g-4">
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm p-4"
            style={{ borderRadius: "15px" }}
          >
            <h6 className="fw-bold mb-3 small text-uppercase text-muted">
              Customer Account Status
            </h6>
            <div className="d-flex align-items-center justify-content-between mb-2 small">
              <span>
                <FiCheckCircle className="text-success me-2" /> Active
              </span>
              <span className="fw-bold">{cards.activeCustomers}</span>
            </div>
            <div className="progress mb-3" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-success"
                style={{
                  width: `${(cards.activeCustomers / cards.totalCustomers) * 100}%`,
                }}
              ></div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2 small">
              <span>
                <FiUserX className="text-danger me-2" /> Deactive
              </span>
              <span className="fw-bold">
                {cards.totalCustomers - cards.activeCustomers}
              </span>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-danger"
                style={{
                  width: `${((cards.totalCustomers - cards.activeCustomers) / cards.totalCustomers) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm p-4"
            style={{ borderRadius: "15px" }}
          >
            
            <h6 className="fw-bold mb-3 small text-uppercase text-muted">
                Owner Approval Status
            </h6>
            <div className="row text-center mb-3">
              <div className="col-6 border-end">
                <p className="text-muted mb-0 small text-uppercase">Pending</p>
                <h4 className="fw-bold text-warning">{cards.pendingOwners}</h4>
              </div>
              <div className="col-6">
                <p className="text-muted mb-0 small text-uppercase">Approved</p>
                <h4 className="fw-bold text-success">{cards.activeOwners}</h4>
              </div>
            </div>
            <div
              className="alert alert-warning border-0 mb-0 py-2 d-flex align-items-center"
              style={{ borderRadius: "10px" }}
            >
              <FiAlertCircle className="me-2" />
              <span className="small">
                Action required on <strong>{cards.pendingOwners}</strong>{" "}
                profiles.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color, footerText }) => (
  <div className="col-md-3">
    <div
      className="card border-0 shadow-sm h-100 overflow-hidden"
      style={{ borderRadius: "15px" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p
              className="text-muted text-uppercase mb-1 fw-bold"
              style={{ fontSize: "11px" }}
            >
              {title}
            </p>
            <h3 className="fw-bold mb-0">{value}</h3>
          </div>
          <div
            className={`fs-2 text-${color} p-3 rounded-circle bg-${color} bg-opacity-10 d-flex align-items-center justify-content-center`}
            style={{ width: "60px", height: "60px" }}
          >
            {icon}
          </div>
        </div>
      </div>
      <div
        className={`bg-${color} bg-opacity-10 px-3 py-2 border-top border-light`}
      >
        <p
          className="small text-dark mb-0 fw-medium"
          style={{ fontSize: "12px" }}
        >
          {footerText}
        </p>
      </div>
    </div>
  </div>
);

export default AdminStats;
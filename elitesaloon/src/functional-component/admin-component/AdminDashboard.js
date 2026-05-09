import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiGrid, FiUsers, FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import OwnerRequests from "./OwnerRequests";
import CustomerTabs from "./CustomerTabs";
import OwnerTabs from "./OwnerTabs";
import AdminStats from "./AdminStats";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [admin, setAdmin] = useState(null);

  // 1. Security Check: Agar Auth nahi hai toh Login pe bhejo
  useEffect(() => {
    const isAdminAuth = localStorage.getItem("isAdminAuthenticated");
    
    if (isAdminAuth !== "true") {
      navigate("/adminlogin", { replace: true });
    } else {
      const savedAdmin = localStorage.getItem("adminData");
      if (savedAdmin) {
        setAdmin(JSON.parse(savedAdmin));
      }
    }
  }, [navigate]);

  const menuItems = [
    { id: "dashboard", icon: <FiGrid />, label: "Dashboard" },
    { id: "owner-requests", icon: <FiUsers />, label: "Owner Requests" },
    { id: "customers", icon: <FiUsers />, label: "Customers" },
    { id: "Owners", icon: <FiUsers />, label: "Owners" },
  ];

  // 2. Logout function with Confirmation
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("adminData");
        navigate("/adminlogin", { replace: true });
      }
    });
  };

  // Agar admin data load nahi hua (unauthorized), toh kuch render na karein
  if (!admin && localStorage.getItem("isAdminAuthenticated") !== "true") {
    return null; 
  }

  return (
    <div className="ad-container">
      {/* SIDEBAR */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-header">
          <div className="ad-logo">
            Elite<span>Saloon</span>
          </div>
          <div className="ad-panel-name">Admin Panel</div>
        </div>

        <nav className="ad-sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`ad-menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}

          <div className="ad-menu-item logout-item" onClick={handleLogout} >
            <FiLogOut />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ad-main-content">
        <header className="ad-header">
          <div className="ad-header-title">
            <h1>
              {activeTab.charAt(0).toUpperCase() +
                activeTab.slice(1).replace("-", " ")}
            </h1>
            <p>Welcome, <strong>{admin?.adminName || "Admin"}</strong> to Elite Saloon Admin Panel</p>
          </div>
        </header>

        <div className="ad-content">
          {activeTab === "owner-requests" && <OwnerRequests />}
          {activeTab === "customers" && <CustomerTabs />}
          {activeTab === "Owners" && <OwnerTabs />}

          {activeTab === "dashboard" && (
    <div className="container-fluid py-4">
        <header className="mb-4">
            <h3 className="fw-bold">Welcome, {admin?.adminName} 👋</h3>
            <p className="text-muted">Elite Saloon system is running smoothly.</p>
        </header>
        <AdminStats />
    </div>
)}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
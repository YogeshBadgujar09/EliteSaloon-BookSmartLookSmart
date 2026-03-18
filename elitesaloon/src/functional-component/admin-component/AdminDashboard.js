import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiUsers, FiLogOut } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import OwnerRequests from "./OwnerRequests";
import "./AdminDashboard.css";

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: <FiGrid />, label: "Dashboard" },
    { id: "owner-requests", icon: <FiUsers />, label: "Owner Requests" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="ad-container">

      {/* SIDEBAR */}
      <aside className="ad-sidebar">

        <div className="ad-sidebar-header">

          <div className="ad-logo">
            Elite<span>Saloon</span>
          </div>

          <div className="ad-panel-name">
            Elite saloon
          </div>

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

          <div className="ad-menu-item" onClick={handleLogout}>
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
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace("-", " ")}
            </h1>

            <p>
              Welcome to Elite Saloon Admin Panel
            </p>

          </div>

        </header>

        <div className="ad-content">

          {activeTab === "owner-requests" && <OwnerRequests />}

          {activeTab === "dashboard" && (

            <div className="row">

              <div className="col-12">

                <div className="card">

                  <div className="card-body text-center">

                    <h4>Elite Saloon Admin Dashboard</h4>

                    <p className="text-muted">
                      Manage salon owners, approve or reject owner registrations.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;
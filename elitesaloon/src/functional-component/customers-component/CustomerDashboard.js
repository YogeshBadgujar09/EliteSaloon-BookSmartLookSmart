import React, { useState, useEffect } from "react";
import "./CustomerDashboard.css";
import CustomerOverview from "./CustomerOverview";
import CustomerProfile from "./CustomerProfile";
import CustomerAppointments from "./CustomerAppointments";
import CustomerServices from "./CustomerServices";
import CustomerProducts from "./CustomerProducts";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaUser,
  FaCalendarAlt,
  FaShoppingBag,
  FaStar,
  FaEdit,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initial state check: Agar reschedule se aa rahe hain toh direct 'bookappointments' tab khule
  const [activeSection, setActiveSection] = useState(
    location.state?.openReschedule ? "bookappointments" : "overview"
  );

  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customer");
    return location.state?.customer || (stored ? JSON.parse(stored) : {});
  });

  // ✅ NEW: Yeh effect handle karega jab hum SelectServices se wapas aayenge
  useEffect(() => {
    if (location.state?.openReschedule) {
      setActiveSection("bookappointments");
    }
  }, [location.state]);

  // Session check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const customerId = localStorage.getItem("customerId");

    if (!isLoggedIn || !customerId) {
      navigate("/customerlogin");
    }
  }, [navigate]);

  const feedbacks = [
    {
      id: 1,
      service: "Hair Coloring",
      rating: 5,
      comment: "Amazing service! Loved the color.",
      date: "2024-02-15",
    },
  ];

  const renderSidebar = () => {
    return (
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="customer-avatar">
            <img
              src={
                !customer?.customerProfileImage ||
                customer.customerProfileImage === "default/defaultProfile.png"
                  ? "http://localhost:5000/uploads/default/defaultProfile.png"
                  : `http://localhost:5000/uploads/customerProfile/${customer.customerProfileImage}?t=${Date.now()}`
              }
              alt={customer.customerName}
            />
          </div>
          <h3>{customer.customerName}</h3>
          <p>{customer.customerEmail}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            <FaUser /> Overview
          </button>
          <button
            className={`nav-item ${activeSection === "bookappointments" ? "active" : ""}`}
            onClick={() => setActiveSection("bookappointments")}
          >
            <FaCalendarAlt /> My Bookings
          </button>

          <button
            className={`nav-item ${activeSection === "services" ? "active" : ""}`}
            onClick={() => setActiveSection("services")}
          >
            <FaShoppingBag /> Services
          </button>

          <button
            className={`nav-item ${activeSection === "products" ? "active" : ""}`}
            onClick={() => setActiveSection("products")}
          >
            <FaShoppingBag /> Products
          </button>

          <button
            className={`nav-item ${activeSection === "feedback" ? "active" : ""}`}
            onClick={() => setActiveSection("feedback")}
          >
            <FaStar /> My Reviews
          </button>

          <button
            className={`nav-item ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            <FaCog /> Profile Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/", { replace: true });
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <CustomerOverview
            customer={customer}
            appointments={[]} 
            navigate={navigate}
            setActiveSection={setActiveSection}
          />
        );
      case "bookappointments":
        // Jab activeSection 'bookappointments' hogi, tabhi ye component load hoga
        // Aur load hote hi iska useEffect Modal khol dega
        return <CustomerAppointments />;
      case "services":
        return <CustomerServices customer={customer} />;
      case "products":
        return <CustomerProducts customer={customer} />;
      case "feedback":
        return renderFeedback(); // Aapka existing renderFeedback function
      case "profile":
        return <CustomerProfile customer={customer} setCustomer={setCustomer} />;
      default:
        return <CustomerOverview />;
    }
  };

  // Helper render for feedback to keep code clean
  const renderFeedback = () => (
    <div className="dashboard-content">
      <div className="content-header"><h2>My Reviews</h2></div>
      <div className="feedback-list">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <div className="feedback-header">
              <h4>{fb.service}</h4>
              <span className="feedback-date">{fb.date}</span>
            </div>
            <div className="feedback-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < fb.rating ? "star filled" : "star"} />
              ))}
            </div>
            <p className="feedback-comment">{fb.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="customer-dashboard">
      {renderSidebar()}
      <div className="dashboard-main">{renderContent()}</div>
    </div>
  );
};

export default CustomerDashboard;
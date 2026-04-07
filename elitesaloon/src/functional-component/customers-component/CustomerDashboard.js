import React, { useState, useEffect } from "react";
import "./CustomerDashboard.css";

import CustomerProfile from "./CustomerProfile";
import CustomerAppointments from "./CustomerAppointments";

import { useNavigate, useLocation } from "react-router-dom";

import {
  FaUser,
  FaCalendarAlt,
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSignOutAlt,
  FaClock,
  FaCheck,
  FaCog,
} from "react-icons/fa";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("overview");

  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customer");
    return location.state?.customer || (stored ? JSON.parse(stored) : {});
  });

  console.log("FINAL CUSTOMER:", customer);

  //  useEffect(() => {
  //   const storedCustomer = {
  //     customerName: localStorage.getItem("customerName"),
  //     customerEmail: localStorage.getItem("customerEmail"),
  //     customerProfileImage: localStorage.getItem("customerImage"),
  //   };

  //   if (storedCustomer.customerName) {
  //     setCustomer(storedCustomer);
  //   }
  // }, []);

  const [appointments] = useState([]);

  //session
  useEffect(() => {
    // 1. Check karein ki kya user logged in hai?
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const customerId = localStorage.getItem("customerId");

    if (!isLoggedIn || !customerId) {
      // Agar data nahi hai, toh login page par bhej do
      navigate("/customerlogin");
    }
  }, [navigate]);

  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/appointment/my"); // 👈 apni API
  //       const data = await res.json();
  //       setAppointments(data);
  //     } catch (error) {
  //       console.error("Error fetching appointments:", error);
  //     }
  //   };

  //   fetchAppointments();
  // }, []);
  const getStatusLabel = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Upcoming";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Mock saved services
  const savedServices = [
    { id: 1, name: "Hair Spa", category: "Hair", price: "₹800 - ₹2000" },
    {
      id: 2,
      name: "Facial Treatment",
      category: "Skin",
      price: "₹800 - ₹3500",
    },
    {
      id: 3,
      name: "Manicure & Pedicure",
      category: "Nails",
      price: "₹400 - ₹1500",
    },
  ];

  // Mock wishlist products
  const wishlistProducts = [
    {
      id: 1,
      name: "Luxe Hair Serum",
      price: "₹450",
      image:
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 5,
      name: "Beard Oil",
      price: "₹299",
      image:
        "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=150&q=80",
    },
  ];

  // Mock feedback
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
    // ✅ console.log JSX ke bahar
    console.log("IMAGE:", customer.customerProfileImage);

    return (
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="customer-avatar">
            <img
              src={
                !customer?.customerProfileImage ||
                customer.customerProfileImage === "defaultProfile.png"
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
          {/* <button
            className={`nav-item ${activeSection === "appointments" ? "active" : ""}`}
            onClick={() => setActiveSection("appointments")}
          >
            <FaCalendarAlt /> My Appointments
          </button> */}

          <button
            className={`nav-item ${activeSection === "saved-services" ? "active" : ""}`}
            onClick={() => setActiveSection("saved-services")}
          >
            <FaHeart /> Saved Services
          </button>

          <button
            className={`nav-item ${activeSection === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveSection("wishlist")}
          >
            <FaShoppingBag /> Wishlist
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
              localStorage.clear(); // Saara session data delete
              navigate("/customerlogin"); // Login page par redirect
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Welcome back, {customer.customerName}!</h2>
        <p>Here's what's happening with your account</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon upcoming">
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {
                appointments.filter((a) => a.appointmentStatus === "CONFIRMED")
                  .length
              }
            </span>
            <span className="stat-label">Upcoming Appointments</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <FaCheck />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {
                appointments.filter((a) => a.appointmentStatus === "COMPLETED")
                  .length
              }
            </span>
            <span className="stat-label">Completed Visits</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon saved">
            <FaHeart />
          </div>
          <div className="stat-info">
            <span className="stat-value">{savedServices.length}</span>
            <span className="stat-label">Saved Services</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon points">
            <FaStar />
          </div>
          <div className="stat-info">
            <span className="stat-value">{customer.loyaltyPoints}</span>
            <span className="stat-label">Loyalty Points</span>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="section-card">
        <div className="section-header">
          <h3>Upcoming Appointments</h3>
          <button
            className="view-all-btn"
            onClick={() => setActiveSection("appointments")}
          >
            View All
          </button>
        </div>
        <div className="appointments-list">
          {appointments
            .filter((a) => a.appointmentStatus === "CONFIRMED")
            .map((apt) => (
              <div key={apt._id} className="appointment-item">
                <div className="appointment-info">
                  <h4>{apt.services?.map((s) => s.serviceName).join(", ")}</h4>
                  <div className="appointment-details">
                    <span>
                      <FaCalendarAlt /> {apt.appointmentDate}
                    </span>
                    <span>
                      <FaClock /> {apt.startTime} - {apt.endTime}
                    </span>
                  </div>
                </div>
                <div className="appointment-actions">
                  <span className="appointment-price">₹{apt.totalPrice}</span>
                  <span
                    className={`status-badge ${apt.appointmentStatus.toLowerCase()}`}
                  >
                    {getStatusLabel(apt.appointmentStatus)}
                  </span>
                </div>
              </div>
            ))}
          {appointments.filter((a) => a.appointmentStatus === "CONFIRMED")
            .length === 0 && (
            <p className="no-data">No upcoming appointments</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="quick-actions">
          <button
            className="action-btn-primary"
            onClick={() =>
              navigate("/bookappointment", {
                state: {
                  customerPincode: customer?.customerPincode || "",
                },
              })
            }
          >
            <FaPlus /> Book New Appointment
          </button>
          <button
            className="action-btn-secondary"
            onClick={() => navigate("/shop")}
          >
            <FaShoppingBag /> Browse Products
          </button>
        </div>
      </div>
    </div>
  );

  const renderSavedServices = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Saved Services</h2>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Browse More
        </button>
      </div>

      <div className="saved-services-grid">
        {savedServices.map((service) => (
          <div key={service.id} className="saved-service-card">
            <div className="service-info">
              <h4>{service.name}</h4>
              <span className="service-category">{service.category}</span>
              <span className="service-price">{service.price}</span>
            </div>
            <div className="service-actions">
              <button
                className="btn-primary"
                onClick={() => navigate("/booking")}
              >
                Book Now
              </button>
              <button className="btn-icon">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>My Wishlist</h2>
        <button className="btn-primary" onClick={() => navigate("/shop")}>
          Browse Shop
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="wishlist-product-card">
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h4>{product.name}</h4>
              <span className="product-price">{product.price}</span>
            </div>
            <div className="product-actions">
              <button className="btn-primary">Add to Cart</button>
              <button className="btn-icon">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>My Reviews</h2>
      </div>

      <div className="feedback-list">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <div className="feedback-header">
              <h4>{fb.service}</h4>
              <span className="feedback-date">{fb.date}</span>
            </div>
            <div className="feedback-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < fb.rating ? "star filled" : "star"}
                />
              ))}
            </div>
            <p className="feedback-comment">{fb.comment}</p>
            <button className="btn-text">
              <FaEdit /> Edit Review
            </button>
          </div>
        ))}
        {feedbacks.length === 0 && <p className="no-data">No reviews yet</p>}
      </div>

      {/* Add Feedback Form */}
      <div className="section-card feedback-form-card">
        <h3>Write a Review</h3>
        <form className="review-form">
          <div className="form-group">
            <label>Select Service</label>
            <select>
              <option>Hair Coloring</option>
              <option>Facial Treatment</option>
              <option>Bridal Makeup</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="star" />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Your Review</label>
            <textarea
              rows="4"
              placeholder="Share your experience..."
            ></textarea>
          </div>
          <button type="submit" className="btn-primary">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "bookappointments":
        return <CustomerAppointments />;
      // case "appointments":
      //   return <AppointmentBook />;
      case "saved-services":
        return renderSavedServices();
      case "wishlist":
        return renderWishlist();
      case "feedback":
        return renderFeedback();
      case "profile":
        return (
          <CustomerProfile customer={customer} setCustomer={setCustomer} />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="customer-dashboard">
      {renderSidebar()}
      <div className="dashboard-main">{renderContent()}</div>

      {/* 🔥 Booking Form Popup */}
      {/* {showBooking && (
        <CustomerBookingForm onClose={() => setShowBooking(false)} />
      )} */}
    </div>
  );
};

export default CustomerDashboard;

import React, { useState } from "react";
import "./CustomerDashboard.css";
import { Link, useNavigate } from "react-router-dom";
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
  const [activeSection, setActiveSection] = useState("overview");
//   const [showEditProfile, setShowEditProfile] = useState(false);

  // Mock customer data
  const customer = {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    memberSince: "January 2023",
    loyaltyPoints: 2450,
    membershipTier: "Gold Member",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  };

  // Mock appointments
  const appointments = [
    {
      id: 1,
      service: "Hair Coloring",
      date: "2024-02-15",
      time: "2:00 PM",
      status: "completed",
      price: "₹3500",
    },
    {
      id: 2,
      service: "Bridal Makeup",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "upcoming",
      price: "₹15000",
    },
    {
      id: 3,
      service: "Body Spa",
      date: "2024-02-28",
      time: "4:00 PM",
      status: "completed",
      price: "₹2500",
    },
  ];

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

  const renderSidebar = () => (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="customer-avatar">
          <img src={customer.avatar} alt={customer.name} />
          <span className="membership-badge">{customer.membershipTier}</span>
        </div>
        <h3>{customer.name}</h3>
        <p>{customer.email}</p>
        <div className="loyalty-points">
          <span className="points-value">{customer.loyaltyPoints}</span>
          <span className="points-label">Loyalty Points</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeSection === "overview" ? "active" : ""}`}
          onClick={() => setActiveSection("overview")}
        >
          <FaUser /> Overview
        </button>
        <button
          className={`nav-item ${activeSection === "appointments" ? "active" : ""}`}
          onClick={() => setActiveSection("appointments")}
        >
          <FaCalendarAlt /> My Appointments
        </button>
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
        <button className="logout-btn" onClick={() => navigate("/")}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Welcome back, {customer.name.split(" ")[0]}!</h2>
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
              {appointments.filter((a) => a.status === "upcoming").length}
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
              {appointments.filter((a) => a.status === "completed").length}
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
            .filter((a) => a.status === "upcoming")
            .map((apt) => (
              <div key={apt.id} className="appointment-item">
                <div className="appointment-info">
                  <h4>{apt.service}</h4>
                  <div className="appointment-details">
                    <span>
                      <FaCalendarAlt /> {apt.date}
                    </span>
                    <span>
                      <FaClock /> {apt.time}
                    </span>
                  </div>
                </div>
                <div className="appointment-actions">
                  <span className="appointment-price">{apt.price}</span>
                  <span className="status-badge upcoming">Upcoming</span>
                </div>
              </div>
            ))}
          {appointments.filter((a) => a.status === "upcoming").length === 0 && (
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
            onClick={() => navigate("/booking")}
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

  const renderAppointments = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>My Appointments</h2>
        <button className="btn-primary" onClick={() => navigate("/booking")}>
          <FaPlus /> Book New
        </button>
      </div>

      <div className="appointments-full-list">
        {appointments.map((apt) => (
          <div key={apt.id} className="appointment-card">
            <div className="appointment-main">
              <h4>{apt.service}</h4>
              <div className="appointment-meta">
                <span>
                  <FaCalendarAlt /> {apt.date}
                </span>
                <span>
                  <FaClock /> {apt.time}
                </span>
              </div>
            </div>
            <div className="appointment-status">
              <span className={`status-badge ${apt.status}`}>
                {apt.status === "completed" ? "Completed" : "Upcoming"}
              </span>
              <span className="appointment-price">{apt.price}</span>
            </div>
            <div className="appointment-actions">
              {apt.status === "completed" && (
                <button
                  className="btn-outline"
                  onClick={() => setActiveSection("feedback")}
                >
                  <FaStar /> Review
                </button>
              )}
              <button className="btn-text">View Details</button>
            </div>
          </div>
        ))}
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

  const renderProfile = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Profile Settings</h2>
      </div>

      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="profile-avatar"
            />
            <button className="btn-outline">Change Photo</button>
          </div>

          <form className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue={customer.name} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={customer.email} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" defaultValue={customer.phone} />
              </div>
              <div className="form-group">
                <label>Member Since</label>
                <input
                  type="text"
                  defaultValue={customer.memberSince}
                  disabled
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="profile-card">
          <h3>Change Password</h3>
          <form className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" />
            </div>
            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "appointments":
        return renderAppointments();
      case "saved-services":
        return renderSavedServices();
      case "wishlist":
        return renderWishlist();
      case "feedback":
        return renderFeedback();
      case "profile":
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="customer-dashboard">
      {renderSidebar()}
      <div className="dashboard-main">{renderContent()}</div>
    </div>
  );
};

export default CustomerDashboard;

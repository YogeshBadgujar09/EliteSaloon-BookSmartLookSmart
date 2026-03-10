import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./OwnerDashboard.css";
import Services from "./Services";
import Products from "./Products";
import Staff from "./Staff";
import OwnerProfile from "./OwnerProfile";
import {
  FiGrid,
  FiUser,
  FiScissors,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiBell,
  FiPlus,
  FiDollarSign,
  FiClock,
  FiStar,
  FiX,
} from "react-icons/fi";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\+?[\d\s-]{10,}$/;
    return mobileRegex.test(mobile);
  };

  const validateServiceForm = () => {
    if (!serviceForm.serviceName || serviceForm.serviceName.trim().length < 2) {
      Swal.fire(
        "Validation Error",
        "Service name must be at least 2 characters",
        "error",
      );
      return false;
    }
    if (
      !serviceForm.serviceDescription ||
      serviceForm.serviceDescription.trim().length < 10
    ) {
      Swal.fire(
        "Validation Error",
        "Service description must be at least 10 characters",
        "error",
      );
      return false;
    }
    if (!serviceForm.servicePrice || Number(serviceForm.servicePrice) <= 0) {
      Swal.fire(
        "Validation Error",
        "Please enter a valid positive price",
        "error",
      );
      return false;
    }
    if (
      !serviceForm.serviceDuration ||
      Number(serviceForm.serviceDuration) <= 0
    ) {
      Swal.fire(
        "Validation Error",
        "Please enter a valid duration in minutes",
        "error",
      );
      return false;
    }
    return true;
  };

  const validateProductForm = () => {
    if (!productForm.productName || productForm.productName.trim().length < 2) {
      Swal.fire(
        "Validation Error",
        "Product name must be at least 2 characters",
        "error",
      );
      return false;
    }
    if (
      !productForm.productDescription ||
      productForm.productDescription.trim().length < 10
    ) {
      Swal.fire(
        "Validation Error",
        "Product description must be at least 10 characters",
        "error",
      );
      return false;
    }
    if (!productForm.productPrice || Number(productForm.productPrice) <= 0) {
      Swal.fire(
        "Validation Error",
        "Please enter a valid positive price",
        "error",
      );
      return false;
    }
    return true;
  };

  const validateStaffForm = () => {
    if (!staffForm.staffName || staffForm.staffName.trim().length < 2) {
      Swal.fire(
        "Validation Error",
        "Staff name must be at least 2 characters",
        "error",
      );
      return false;
    }
    if (!staffForm.staffEmail || !validateEmail(staffForm.staffEmail)) {
      Swal.fire(
        "Validation Error",
        "Please enter a valid email address",
        "error",
      );
      return false;
    }
    if (!staffForm.staffMobile || !validateMobile(staffForm.staffMobile)) {
      Swal.fire(
        "Validation Error",
        "Please enter a valid mobile number (at least 10 digits)",
        "error",
      );
      return false;
    }
    if (
      !staffForm.staffSpecialization ||
      staffForm.staffSpecialization.trim().length < 2
    ) {
      Swal.fire(
        "Validation Error",
        "Please enter at least one specialization",
        "error",
      );
      return false;
    }
    return true;
  };

  // Owner Profile State
  const [ownerProfile, setOwnerProfile] = useState({
    ownerName: "Elite Owner",
    ownerEmail: "owner@elitesaloon.com",
    ownerMobile: "+91 9876543210",
    ownerShopName: "Elite Saloon",
    ownerShopStreet: "123 Luxury Street",
    ownerShopCity: "Mumbai",
    ownerShopState: "Maharashtra",
    ownerShopPincode: "400001",
    ownerShopDistrict: "Mumbai",
  });

  // Services State
  const [services, setServices] = useState([]);
  const [serviceCategory, setServiceCategory] = useState("all");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    serviceDescription: "",
    serviceType: "HAIRCUT",
    servicePreferredGender: "BOTH",
    servicePrice: "",
    serviceDuration: "",
    serviceImages: [""],
  });

  // Products State
  const [products, setProducts] = useState([]);
  const [productCategory, setProductCategory] = useState("all");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productName: "",
    productDescription: "",
    productType: "HAIRGEL",
    productPreferredGender: "BOTH",
    productPrice: "",
    productImages: [""],
  });

  // Staff State
  const [staff, setStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    staffName: "",
    staffEmail: "",
    staffMobile: "",
    staffGender: "male",
    staffRole: "stylist",
    staffSpecialization: "",
    staffExperience: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const serviceRes = await axios.get("/api/services");
      const productRes = await axios.get("/api/products");
      const staffRes = await axios.get("/api/staff");

      setServices(serviceRes.data || []);
      setProducts(productRes.data || []);
      setStaff(staffRes.data || []);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices =
    serviceCategory === "all"
      ? services
      : services.filter((s) => s.servicePreferredGender === serviceCategory);
  const filteredProducts =
    productCategory === "all"
      ? products
      : products.filter((p) => p.productPreferredGender === productCategory);

  const getCategoryLabel = (category) => {
    switch (category) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      case "BOTH":
        return "Unisex";
      default:
        return category;
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateServiceForm()) {
      return;
    }

    const serviceData = {
      ...serviceForm,
      servicePrice: Number(serviceForm.servicePrice),
      serviceDuration: Number(serviceForm.serviceDuration),
    };

    try {
      if (editingService) {
        await axios.put(`/api/services/${editingService._id}`, serviceData);
        Swal.fire("Success", "Service updated successfully", "success");
      } else {
        await axios.post(`/api/services`, serviceData);
        Swal.fire("Success", "Service added successfully", "success");
      }

      fetchDashboardData();
      closeServiceModal();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteService = async (id) => {
    Swal.fire({
      title: "Delete Service",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#800020",
      cancelButtonColor: "#666",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/services/${id}`);
        fetchDashboardData();
        Swal.fire("Deleted", "Service deleted successfully", "success");
      }
    });
  };
  const openEditService = (service) => {
    setEditingService(service);
    setServiceForm(service);
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
    setServiceForm({
      serviceName: "",
      serviceDescription: "",
      serviceType: "HAIRCUT",
      servicePreferredGender: "BOTH",
      servicePrice: "",
      serviceDuration: "",
      serviceImages: [""],
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateProductForm()) {
      return;
    }

    const productData = {
      ...productForm,
      productPrice: Number(productForm.productPrice),
    };

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productData);
        Swal.fire("Success", "Product updated successfully", "success");
      } else {
        await axios.post(`/api/products`, productData);
        Swal.fire("Success", "Product added successfully", "success");
      }

      fetchDashboardData();
      closeProductModal();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Delete Product",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#800020",
      cancelButtonColor: "#666",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/products/${id}`);
        fetchDashboardData();
        Swal.fire("Deleted", "Product deleted successfully", "success");
      }
    });
  };
  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      productName: "",
      productDescription: "",
      productType: "HAIRGEL",
      productPreferredGender: "BOTH",
      productPrice: "",
      productImages: [""],
    });
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateStaffForm()) {
      return;
    }

    const staffData = {
      ...staffForm,
      staffSpecialization: staffForm.staffSpecialization
        .split(",")
        .map((s) => s.trim()),
    };

    try {
      if (editingStaff) {
        await axios.put(`/api/staff/${editingStaff._id}`, staffData);
        Swal.fire("Success", "Staff updated successfully", "success");
      } else {
        await axios.post(`/api/staff`, staffData);
        Swal.fire("Success", "Staff added successfully", "success");
      }

      fetchDashboardData();
      closeStaffModal();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStaff = async (id) => {
    Swal.fire({
      title: "Delete Staff",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#800020",
      cancelButtonColor: "#666",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/staff/${id}`);
        fetchDashboardData();
        Swal.fire("Deleted", "Staff deleted successfully", "success");
      }
    });
  };
  const openEditStaff = (member) => {
    setEditingStaff(member);
    setStaffForm({
      ...member,
      staffSpecialization: member.staffSpecialization.join(", "),
    });
    setShowStaffModal(true);
  };

  const closeStaffModal = () => {
    setShowStaffModal(false);
    setEditingStaff(null);
    setStaffForm({
      staffName: "",
      staffEmail: "",
      staffMobile: "",
      staffGender: "male",
      staffRole: "stylist",
      staffSpecialization: "",
      staffExperience: "",
    });
  };



  const menuItems = [
    { id: "dashboard", icon: <FiGrid />, label: "Dashboard" },
    { id: "profile", icon: <FiUser />, label: "My Profile" },
    { id: "services", icon: <FiScissors />, label: "Services" },
    { id: "products", icon: <FiShoppingBag />, label: "Products" },
    { id: "staff", icon: <FiUsers />, label: "Staff" },
    { id: "reports", icon: <FiBarChart2 />, label: "Reports" },
    { id: "settings", icon: <FiSettings />, label: "Settings" },
  ];

  if (loading) {
    return (
      <div className="od-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="od-container">
      {/* SIDEBAR */}
      <aside className="od-sidebar">
        <div className="od-sidebar-header">
          <div className="od-logo">
            Elite<span>Saloon</span>
          </div>
          <div className="od-salon-name">{ownerProfile.ownerShopName}</div>
        </div>
        <nav className="od-sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`od-menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
          <div className="od-menu-item" onClick={() => navigate("/")}>
            <FiLogOut />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="od-main-content">
        <header className="od-header">
          <div className="od-header-title">
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Welcome back, {ownerProfile.ownerName}</p>
          </div>
          <div className="od-header-actions">
            <button className="od-notification-btn">
              <FiBell />
              <span className="od-notification-badge">3</span>
            </button>
            <div className="od-profile-dropdown">
              <img
                src="https://via.placeholder.com/45"
                alt="Profile"
                className="od-profile-img"
              />
              <div className="od-profile-info">
                <div className="od-profile-name">{ownerProfile.ownerName}</div>
                <div className="od-profile-role">Owner</div>
              </div>
            </div>
          </div>
        </header>

        <div className="od-content">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="od-stats-grid">
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiScissors />
                  </div>
                  <div className="od-stat-value">{services.length}</div>
                  <div className="od-stat-label">Total Services</div>
                </div>
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiShoppingBag />
                  </div>
                  <div className="od-stat-value">{products.length}</div>
                  <div className="od-stat-label">Total Products</div>
                </div>
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiUsers />
                  </div>
                  <div className="od-stat-value">{staff.length}</div>
                  <div className="od-stat-label">Staff Members</div>
                </div>
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiDollarSign />
                  </div>
                  <div className="od-stat-value">₹256</div>
                  <div className="od-stat-label">Total Customers</div>
                </div>
              </div>
              <div className="od-section">
                <div className="od-section-header">
                  <h2 className="od-section-title">Recent Services</h2>
                  <button
                    className="od-btn-add"
                    onClick={() => {
                      setActiveTab("services");
                      setShowServiceModal(true);
                    }}
                  >
                    <FiPlus /> Add Service
                  </button>
                </div>
                <div className="od-card-grid">
                  {services.slice(0, 3).map((service) => (
                    <div key={service._id} className="od-item-card">
                      <div
                        className="od-item-image"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "40px",
                          color: "#ccc",
                        }}
                      >
                        <FiScissors />
                      </div>
                      <div className="od-item-content">
                        <span
                          className={`od-item-category ${service.servicePreferredGender.toLowerCase()}`}
                        >
                          {getCategoryLabel(service.servicePreferredGender)}
                        </span>
                        <h3 className="od-item-name">{service.serviceName}</h3>
                        <p className="od-item-description">
                          {service.serviceDescription}
                        </p>
                        <div className="od-item-meta">
                          <div className="od-item-price">
                            ₹{service.servicePrice}
                          </div>
                          <div className="od-item-duration">
                            <FiClock /> {service.serviceDuration} min
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}



          {/* PROFILE */}
          {activeTab === "profile" && (
            <OwnerProfile
              ownerProfile={ownerProfile}
              setOwnerProfile={setOwnerProfile}
            />
          )}

          {/* SERVICES */}
          {activeTab === "services" && (
            <Services
              filteredServices={filteredServices}
              serviceCategory={serviceCategory}
              setServiceCategory={setServiceCategory}
              setShowServiceModal={setShowServiceModal}
              openEditService={openEditService}
              deleteService={deleteService}
              getCategoryLabel={getCategoryLabel}
            />
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <Products
              filteredProducts={filteredProducts}
              productCategory={productCategory}
              setProductCategory={setProductCategory}
              setShowProductModal={setShowProductModal}
              openEditProduct={openEditProduct}
              deleteProduct={deleteProduct}
              getCategoryLabel={getCategoryLabel}
            />
          )}

          {/* STAFF */}
          {activeTab === "staff" && (
            <Staff
              staff={staff}
              setShowStaffModal={setShowStaffModal}
              openEditStaff={openEditStaff}
              deleteStaff={deleteStaff}
            />
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <div className="od-section">
              <div className="od-section-header">
                <h2 className="od-section-title">Reports & Analytics</h2>
              </div>
              <div className="od-stats-grid">
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiDollarSign />
                  </div>
                  <div className="od-stat-value">₹4,25,000</div>
                  <div className="od-stat-label">Monthly Revenue</div>
                </div>
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiUser />
                  </div>
                  <div className="od-stat-value">156</div>
                  <div className="od-stat-label">New Customers</div>
                </div>
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiStar />
                  </div>
                  <div className="od-stat-value">4.8</div>
                  <div className="od-stat-label">Avg Rating</div>
                </div>
                <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiScissors />
                  </div>
                  <div className="od-stat-value">520</div>
                  <div className="od-stat-label">Services Done</div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="od-section">
              <div className="od-section-header">
                <h2 className="od-section-title">Settings</h2>
              </div>
              <div className="od-card" style={{ padding: "30px" }}>
                <div className="od-profile-form">
                  <div className="od-form-group">
                    <label>Business Email</label>
                    <input
                      type="email"
                      defaultValue={ownerProfile.ownerEmail}
                    />
                  </div>
                  <div className="od-form-group">
                    <label>Business Phone</label>
                    <input
                      type="text"
                      defaultValue={ownerProfile.ownerMobile}
                    />
                  </div>
                </div>
                <button className="od-btn-save" style={{ marginTop: "20px" }}>
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SERVICE MODAL */}
      {showServiceModal && (
        <div className="od-modal-overlay active" onClick={closeServiceModal}>
          <div className="od-modal" onClick={(e) => e.stopPropagation()}>
            <div className="od-modal-header">
              <h3>{editingService ? "Edit Service" : "Add New Service"}</h3>
              <button className="od-modal-close" onClick={closeServiceModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleServiceSubmit}>
              <div className="od-modal-body">
                <div className="od-form-group">
                  <label>Service Name</label>
                  <input
                    type="text"
                    value={serviceForm.serviceName}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        serviceName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Description</label>
                  <textarea
                    value={serviceForm.serviceDescription}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        serviceDescription: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Service Type</label>
                  <select
                    value={serviceForm.serviceType}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        serviceType: e.target.value,
                      })
                    }
                  >
                    <option value="HAIRCUT">Haircut</option>
                    <option value="BEARD">Beard</option>
                    <option value="FACIAL">Facial</option>
                    <option value="MAKEUP">Makeup</option>
                    <option value="SKIN">Skin</option>
                  </select>
                </div>
                <div className="od-form-group">
                  <label>Preferred Gender</label>
                  <select
                    value={serviceForm.servicePreferredGender}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        servicePreferredGender: e.target.value,
                      })
                    }
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="BOTH">Unisex</option>
                  </select>
                </div>
                <div className="od-form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={serviceForm.servicePrice}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        servicePrice: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={serviceForm.serviceDuration}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        serviceDuration: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="od-modal-footer">
                <button
                  type="button"
                  className="od-btn-cancel"
                  onClick={closeServiceModal}
                >
                  Cancel
                </button>
                <button type="submit" className="od-btn-save">
                  {editingService ? "Update" : "Add"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div className="od-modal-overlay active" onClick={closeProductModal}>
          <div className="od-modal" onClick={(e) => e.stopPropagation()}>
            <div className="od-modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="od-modal-close" onClick={closeProductModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="od-modal-body">
                <div className="od-form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productForm.productName}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Description</label>
                  <textarea
                    value={productForm.productDescription}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productDescription: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Product Type</label>
                  <select
                    value={productForm.productType}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productType: e.target.value,
                      })
                    }
                  >
                    <option value="HAIRGEL">Hair Gel</option>
                    <option value="FACEWASH">Face Wash</option>
                    <option value="SUNSCREAM">Sunscreen</option>
                  </select>
                </div>
                <div className="od-form-group">
                  <label>Preferred Gender</label>
                  <select
                    value={productForm.productPreferredGender}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productPreferredGender: e.target.value,
                      })
                    }
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="BOTH">Unisex</option>
                  </select>
                </div>
                <div className="od-form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.productPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productPrice: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="od-modal-footer">
                <button
                  type="button"
                  className="od-btn-cancel"
                  onClick={closeProductModal}
                >
                  Cancel
                </button>
                <button type="submit" className="od-btn-save">
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {showStaffModal && (
        <div className="od-modal-overlay active" onClick={closeStaffModal}>
          <div className="od-modal" onClick={(e) => e.stopPropagation()}>
            <div className="od-modal-header">
              <h3>{editingStaff ? "Edit Staff" : "Add New Staff"}</h3>
              <button className="od-modal-close" onClick={closeStaffModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleStaffSubmit}>
              <div className="od-modal-body">
                <div className="od-form-group">
                  <label>Staff Name</label>
                  <input
                    type="text"
                    value={staffForm.staffName}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, staffName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={staffForm.staffEmail}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, staffEmail: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Mobile</label>
                  <input
                    type="text"
                    value={staffForm.staffMobile}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffMobile: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="od-form-group">
                  <label>Gender</label>
                  <select
                    value={staffForm.staffGender}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffGender: e.target.value,
                      })
                    }
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="od-form-group">
                  <label>Role</label>
                  <select
                    value={staffForm.staffRole}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, staffRole: e.target.value })
                    }
                  >
                    <option value="stylist">Stylist</option>
                    <option value="colorist">Colorist</option>
                    <option value="therapist">Therapist</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                </div>
                <div className="od-form-group">
                  <label>Specialization (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., Haircut, Styling"
                    value={staffForm.staffSpecialization}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffSpecialization: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="od-form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    placeholder="e.g., 5 years"
                    value={staffForm.staffExperience}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffExperience: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="od-modal-footer">
                <button
                  type="button"
                  className="od-btn-cancel"
                  onClick={closeStaffModal}
                >
                  Cancel
                </button>
                <button type="submit" className="od-btn-save">
                  {editingStaff ? "Update" : "Add"} Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;

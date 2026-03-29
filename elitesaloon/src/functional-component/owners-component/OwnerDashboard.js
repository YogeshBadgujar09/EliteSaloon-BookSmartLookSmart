import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "react-icons/fi";

const OwnerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

const owner =location.state?.owner || JSON.parse(localStorage.getItem("owner"));
  // console.log("Owner Print at Dashboard :", owner);

  const [ownerProfile, setOwnerProfile] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerMobile: "",
    ownerShopName: "",
    ownerShopStreet: "",
    ownerShopCity: "",
    ownerShopState: "",
    ownerShopPincode: "",
    ownerShopDistrict: "",
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
    serviceImages: [],
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
    productImages: [],
  });

  // Staff State
  const [staff, setStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    staffName: "",
    staffEmail: "",
    staffPhone: "",
    staffAddress:"",
   
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      // if (!ownerId) {
      //   navigate("/"); // agar ownerId nahi hai to redirect
      //   return;
      // }

      const ownerRes = owner;
      setOwnerProfile(ownerRes || {});

      const ownerId = ownerRes._id;

      // 🔹 Fetch other dashboard data
      const serviceRes = await axios.get(
        `http://localhost:5000/owner/allservices/${ownerId}`,
      );

      // console.log("Services after Login :",serviceRes.data );
      const serviceData = Array.isArray(serviceRes.data.services)
        ? serviceRes.data.services
        : [];
      setServices(serviceData);

      const productRes = await axios.get(
        `http://localhost:5000/owner/viewall-products/${ownerId}`,
      );

      // console.log("Product Resonese :", productRes.data);
      const productData = Array.isArray(productRes.data.products)
        ? productRes.data.products
        : [];

      setProducts(productData);

      const staffRes = await axios.get(
        `http://localhost:5000/owner/staff-list/${ownerId}`,
      );
      console.log("Staff List :", staffRes.data);
      const staffData = Array.isArray(staffRes.data.staff)
        ? staffRes.data.staff
        : [];

      setStaff(staffData);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  const filteredServices = Array.isArray(services)
    ? serviceCategory === "all"
      ? services
      : services.filter(
          (s) => s.servicePreferredGender === serviceCategory.toUpperCase(),
        )
    : [];

  const filteredProducts = Array.isArray(products)
    ? productCategory === "all"
      ? products
      : products.filter(
          (p) => p.productPreferredGender === productCategory.toUpperCase(),
        )
    : [];

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

  ///services handlesubmit
  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("serviceName", serviceForm.serviceName);
    formData.append("serviceDescription", serviceForm.serviceDescription);
    formData.append("serviceType", serviceForm.serviceType);
    formData.append(
      "servicePreferredGender",
      serviceForm.servicePreferredGender,
    );
    formData.append("servicePrice", serviceForm.servicePrice);
    formData.append("serviceDuration", serviceForm.serviceDuration);

    formData.append("ownerId", owner._id);

    for (let i = 0; i < serviceForm.serviceImages.length; i++) {
      formData.append("serviceImages", serviceForm.serviceImages[i]);
    }

    try {
      if (editingService && editingService._id) {
        await axios.put(
          `http://localhost:5000/owner/update-service/${editingService._id}`,
          formData,
        );
        Swal.fire("Success", "Service updated successfully", "success");
      } else {
        await axios.post(`http://localhost:5000/owner/add-service`, formData);
        Swal.fire("Success", "Service added successfully", "success");
      }

      fetchDashboardData();
      closeServiceModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Service save failed", "error");
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
        await axios.delete(`http://localhost:5000/owner/delete-service/${id}`);
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
      serviceImages: [],
    });
  };

  ///product handlesubmit
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Validation call

    const formData = new FormData();

    formData.append("productName", productForm.productName);
    formData.append("productType", productForm.productType);
    formData.append("productDescription", productForm.productDescription);
    formData.append("productPrice", productForm.productPrice);
    formData.append(
      "productPreferredGender",
      productForm.productPreferredGender,
    );

    formData.append("ownerId", owner._id);

    for (let i = 0; i < productForm.productImages.length; i++) {
      formData.append("productImages", productForm.productImages[i]);
    }

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/owner/update-product/${editingProduct._id}`,
          formData,
        );
        Swal.fire("Success", "Product updated successfully", "success");
      } else {
        await axios.post(`http://localhost:5000/owner/add-product`, formData);
        Swal.fire("Success", "Product added successfully", "success");
      }

      fetchDashboardData();
      closeProductModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Product save failed", "error");
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
        await axios.delete(`http://localhost:5000/owner/delete-product/${id}`);
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
      productImages: [],
    });
  };

  ///staff handlesubmit
 const handleStaffSubmit = async (formData, callback) => {
    try {
      // ownerId add karo
      formData.append("ownerId", owner._id);

      if (editingStaff) {
        await axios.put(
          `http://localhost:5000/api/staff/${editingStaff._id}`,
          formData,
        );

        Swal.fire("Success", "Staff updated successfully", "success");
      } else {
        const res = await axios.post(
          `http://localhost:5000/owner/add-staff/${owner._id}`,
          formData,
        );
      const email = res.data.staffEmail;

if (callback) {
  callback(email);
}
        // console.log("Staff Receive :", res.data.staffEmail);

        // if(res.ok)
        // {
        //      navigate("/staffotpverify",
        //      {state: { staffEmail: email }} );
        // }

        Swal.fire("Success", "OTP sent successfully", "success");
      }

      fetchDashboardData();
      closeStaffModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Staff save failed", "error");
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
      staffGender: "MALE",
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
                {/* <div className="od-stat-card">
                  <div className="od-stat-icon">
                    <FiDollarSign />
                  </div>
                  <div className="od-stat-value">₹256</div>
                  <div className="od-stat-label">Total Customers</div>
                </div> */}
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
                  {services.slice(0, 3).map((service) => {
                    console.log("Service Data:", service);
                    console.log("Service Images:", service.serviceImages);

                    return (
                      <div key={service._id} className="od-item-card">
                        {/* IMAGE SECTION */}
                        <div className="od-item-image">
                          {service.serviceImages &&
                          service.serviceImages.length > 0 ? (
                            <img
                              src={`http://localhost:5000/uploads/serviceImages/${service.serviceImages[0]}`}
                              alt="service"
                             
                              onError={(e) => {
                                console.log(
                                  "Image load error:",
                                  service.serviceImages[0],
                                );
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "150px",
                                fontSize: "40px",
                                color: "#ccc",
                              }}
                            >
                              <FiScissors />
                            </div>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="od-item-content">
                          <span
                            className={`od-item-category ${service.servicePreferredGender?.toLowerCase()}`}
                          >
                            {getCategoryLabel(service.servicePreferredGender)}
                          </span>

                          <h3 className="od-item-name">
                            {service.serviceName}
                          </h3>

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
                    );
                  })}
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
              showServiceModal={showServiceModal}
              setShowServiceModal={setShowServiceModal}
              serviceForm={serviceForm}
              setServiceForm={setServiceForm}
              editingService={editingService}
              handleServiceSubmit={handleServiceSubmit}
              openEditService={openEditService}
              closeServiceModal={closeServiceModal}
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
              showProductModal={showProductModal}
              setShowProductModal={setShowProductModal}
              productForm={productForm}
              setProductForm={setProductForm}
              editingProduct={editingProduct}
              handleProductSubmit={handleProductSubmit}
              openEditProduct={openEditProduct}
              closeProductModal={closeProductModal}
              deleteProduct={deleteProduct}
              getCategoryLabel={getCategoryLabel}
            />
          )}

          {/* STAFF */}
          {activeTab === "staff" && (
            <Staff
              staff={staff}
              showStaffModal={showStaffModal}
              setShowStaffModal={setShowStaffModal}
              staffForm={staffForm}
              setStaffForm={setStaffForm}
              editingStaff={editingStaff}
              handleStaffSubmit={handleStaffSubmit}
              openEditStaff={openEditStaff}
              closeStaffModal={closeStaffModal}
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
    </div>
  );
};

export default OwnerDashboard;

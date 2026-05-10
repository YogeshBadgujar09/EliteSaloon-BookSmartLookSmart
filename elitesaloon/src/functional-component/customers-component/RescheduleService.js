import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import "./SelectServices.css";

const RescheduleService = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Location state se data nikaalna
  const {
    salonId,
    selectedServices: prevSelected,
    appointmentData,
  } = location.state || {};

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(prevSelected || []);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeGender, setActiveGender] = useState("ALL");

  useEffect(() => {
    if (prevSelected) {
      setSelectedServices(prevSelected);
    }
  }, [prevSelected]);

  useEffect(() => {
    if (!salonId) return;

    const fetchServices = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/owner/allservices/${salonId}`
        );
        const data = await res.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, [salonId]);

  if (!salonId) {
    return (
      <div className="error-screen">
        <p>No Salon ID found. Please try again from the dashboard.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // ✅ LOGIC FIX: Helper to handle both Backend (serviceId) and Frontend (_id)
  const getId = (s) => (s.serviceId || s._id)?.toString();

  const toggleService = (service) => {
    const currentId = getId(service);
    const isSelected = selectedServices.some(
      (s) => getId(s) === currentId
    );

    if (isSelected) {
      setSelectedServices(
        selectedServices.filter((s) => getId(s) !== currentId)
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const total = selectedServices.reduce(
    (sum, s) => sum + (s.servicePrice || s.price || 0),
    0
  );

  const handleContinue = () => {
    navigate("/customerdashboard", {
      state: {
        selectedServices,
        appointmentData,
        openReschedule: true, 
        activeTab: "appointments" 
      },
    });
  };

  const categories = ["ALL", ...new Set(services.map((s) => s.serviceType))];
  const genders = ["ALL", "MALE", "FEMALE", "BOTH"];

  const filteredServices = services.filter((s) => {
    const catMatch = activeCategory === "ALL" || s.serviceType === activeCategory;
    const genMatch = activeGender === "ALL" || s.servicePreferredGender === activeGender;
    return catMatch && genMatch;
  });

  return (
    <div className="services-page">
      <div className="header-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoChevronBack size={20} /> Back
        </button>
        <h2 className="title">Update Appointment Services</h2>
        <div style={{ width: "80px" }}></div>
      </div>

      <div className="filters-container">
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filter-bar">
          {genders.map((g) => (
            <button
              key={g}
              className={activeGender === g ? "active" : ""}
              onClick={() => setActiveGender(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="cards">
        {filteredServices.map((s) => {
          // ✅ LOGIC FIX: Match using the fixed getId function
          const selected = selectedServices.some((x) => getId(x) === s._id.toString());

          return (
            <div key={s._id} className={`card ${selected ? "selected" : ""}`}>
              <div className="image-wrapper">
                <img
                  src={
                    s.serviceImages?.length
                      ? `http://localhost:5000/uploads/serviceImages/${s.serviceImages[0]}`
                      : "/default.jpg"
                  }
                  alt={s.serviceName}
                />
                <span className="badge">{s.servicePreferredGender}</span>
              </div>

              <div className="card-body">
                <h3>{s.serviceName}</h3>
                <div className="info">⏱ {s.serviceDuration} min</div>

                <div className="bottom">
                  <span className="price">₹{s.servicePrice}</span>
                  <button
                    className={selected ? "remove" : "add"}
                    onClick={() => toggleService(s)}
                  >
                    {selected ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="footer-action-bar">
        <div className="footer-info">
          <span className="count">{selectedServices.length} Selected</span>
          <span className="total-amount">Total: ₹{total}</span>
        </div>

        <button
          className="btn-continue"
          disabled={selectedServices.length === 0}
          onClick={handleContinue}
        >
          Confirm & Go Back
        </button>
      </div>
    </div>
  );
};

export default RescheduleService;
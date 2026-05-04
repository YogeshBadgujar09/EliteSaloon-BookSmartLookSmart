import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import "./SelectServices.css";

const SelectServices = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    salonId,
    selectedServices: prevSelected,
    fromReschedule,
    appointmentData
  } = location.state || {};

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(prevSelected || []);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeGender, setActiveGender] = useState("ALL");

  // ✅ IMPORTANT FIX: jab wapas aate ho tab state sync karo
  useEffect(() => {
    if (prevSelected) {
      setSelectedServices(prevSelected);
    }
  }, [prevSelected]);

  // ✅ Fetch services
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
        console.log(err);
      }
    };

    fetchServices();
  }, [salonId]);

  if (!salonId)
    return <div className="error-screen">Please select salon first</div>;

  const categories = ["ALL", ...new Set(services.map((s) => s.serviceType))];
  const genders = ["ALL", "MALE", "FEMALE", "BOTH"];

  const filteredServices = services.filter((s) => {
    const catMatch =
      activeCategory === "ALL" || s.serviceType === activeCategory;
    const genMatch =
      activeGender === "ALL" || s.servicePreferredGender === activeGender;
    return catMatch && genMatch;
  });

 const getId = (s) => s._id || s.serviceId;

const toggleService = (service) => {
  const isSelected = selectedServices.some(
    (s) => getId(s) === getId(service)
  );

  if (isSelected) {
    setSelectedServices(
      selectedServices.filter((s) => getId(s) !== getId(service))
    );
  } else {
    setSelectedServices([...selectedServices, service]);
  }
};

const total = selectedServices.reduce(
  (sum, s) => sum + (s.servicePrice || s.price || 0),
  0
);

  return (
    <div className="services-page">
      <div className="header-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <IoChevronBack size={20} /> Cancel
        </button>
        <h2 className="title">Select Services</h2>
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
const selected = selectedServices.some(
  (x) => (x._id || x.serviceId) === s._id
);

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
          <span className="count">
            {selectedServices.length} Services Selected
          </span>
          <span className="total-amount">₹{total}</span>
        </div>

        {/* ✅ FINAL FIX */}
        <button
          className="btn-continue"
          onClick={() => {
            if (fromReschedule) {
              navigate("/customerdashboard", {
                state: {
                  selectedServices,
                  fromReschedule: true,
                  appointmentData
                }
              });
            } else {
              navigate("/bookappointment", {
                state: {
                  selectedServices,
                  salonId
                }
              });
            }
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectServices;
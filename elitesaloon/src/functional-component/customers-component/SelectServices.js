import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import "./SelectServices.css";

const SelectServices = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract salonId and prevSelected from location state
  const { salonId, selectedServices: prevSelected } = location.state || {};
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(prevSelected || []);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeGender, setActiveGender] = useState("ALL");

  useEffect(() => {
    if (!salonId) return;
    const fetchServices = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/owner/allservices/${salonId}`,
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

  const toggleService = (service) => {
    const isSelected = selectedServices.some((s) => s._id === service._id);
    if (isSelected) {
      setSelectedServices(
        selectedServices.filter((s) => s._id !== service._id),
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const total = selectedServices.reduce((sum, s) => sum + s.servicePrice, 0);

  // ✅ FIX: navigate(-1) ki jagah direct route use karein aur salonId wapas bhejein
  //   const handleContinue = () => {
  //     navigate("/booking", {
  //       state: {
  //         selectedServices,
  //         salonId // Yeh salonId bhejna sabse zaroori hai
  //       }
  //     });
  //   };

  return (
    <div className="services-page">
      <div className="header-nav">
        {/* Cancel button: bina data ke piche jane ke liye */}
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
          const selected = selectedServices.some((x) => x._id === s._id);
          return (
            <div key={s._id} className={`card ${selected ? "selected" : ""}`}>
              <div className="image-wrapper">
              
                <img
                  src={`http://localhost:5000/uploads/serviceImages/${s.serviceImages[0]}`}
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
        {/* ✅ Continue button uses the new function */}
        <button
          className="btn-continue"
          onClick={() =>
            navigate("/bookappointment", {
              state: {
                selectedServices,
                salonId, // <--- Yeh bhejenge tabhi Booking form ko pata chalega
              },
            })
          }
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectServices;

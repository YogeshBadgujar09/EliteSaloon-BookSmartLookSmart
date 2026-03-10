import React from "react";
import { FiScissors, FiEdit2, FiTrash2, FiClock, FiPlus } from "react-icons/fi";

const Service = ({
  filteredServices,
  serviceCategory,
  setServiceCategory,
  setShowServiceModal,
  openEditService,
  deleteService,
  getCategoryLabel,
}) => {
  return (
    <div className="od-section">
      <div className="od-section-header">
        <h2 className="od-section-title">Service Management</h2>
        <button className="od-btn-add" onClick={() => setShowServiceModal(true)}>
          <FiPlus /> Add Service
        </button>
      </div>

      <div className="od-category-tabs">
        <div
          className={`od-category-tab ${serviceCategory === "all" ? "active" : ""}`}
          onClick={() => setServiceCategory("all")}
        >
          All Services
        </div>

        <div
          className={`od-category-tab ${serviceCategory === "MALE" ? "active" : ""}`}
          onClick={() => setServiceCategory("MALE")}
        >
          Male
        </div>

        <div
          className={`od-category-tab ${serviceCategory === "FEMALE" ? "active" : ""}`}
          onClick={() => setServiceCategory("FEMALE")}
        >
          Female
        </div>

        <div
          className={`od-category-tab ${serviceCategory === "BOTH" ? "active" : ""}`}
          onClick={() => setServiceCategory("BOTH")}
        >
          Unisex
        </div>
      </div>

      <div className="od-card-grid">
        {filteredServices.map((service) => (
          <div key={service._id} className="od-item-card">
            <div className="od-item-image">
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
                <div className="od-item-price">₹{service.servicePrice}</div>

                <div className="od-item-duration">
                  <FiClock /> {service.serviceDuration} min
                </div>
              </div>

              <div className="od-item-actions">
                <button
                  className="od-btn od-btn-edit"
                  onClick={() => openEditService(service)}
                >
                  <FiEdit2 /> Edit
                </button>

                <button
                  className="od-btn od-btn-delete"
                  onClick={() => deleteService(service._id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
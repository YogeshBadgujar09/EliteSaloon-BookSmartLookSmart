import React from "react";
import Swal from "sweetalert2";
import { FiScissors, FiEdit2, FiTrash2, FiClock, FiPlus, FiX } from "react-icons/fi";

const Service = ({
  filteredServices,
  serviceCategory,
  setServiceCategory,
  setShowServiceModal,
  showServiceModal,
  serviceForm,
  setServiceForm,
  handleServiceSubmit,
  editingService,
  closeServiceModal,
  openEditService,
  deleteService,
  getCategoryLabel,
}) => {

  // VALIDATION FUNCTION
  const validateServiceForm = () => {

    if (!serviceForm.serviceName || serviceForm.serviceName.trim().length < 3) {
      Swal.fire("Validation Error", "Service name must be at least 3 characters", "error");
      return false;
    }

    if (!serviceForm.serviceType) {
      Swal.fire("Validation Error", "Please select service type", "error");
      return false;
    }

    if (!serviceForm.serviceDescription || serviceForm.serviceDescription.trim().length < 10) {
      Swal.fire("Validation Error", "Description must be at least 10 characters", "error");
      return false;
    }

    if (!serviceForm.servicePrice || serviceForm.servicePrice <= 0) {
      Swal.fire("Validation Error", "Price must be greater than 0", "error");
      return false;
    }

    if (!serviceForm.serviceDuration || serviceForm.serviceDuration <= 0) {
      Swal.fire("Validation Error", "Duration must be greater than 0 minutes", "error");
      return false;
    }

    if (!serviceForm.servicePreferredGender) {
      Swal.fire("Validation Error", "Please select preferred gender", "error");
      return false;
    }

    if (!editingService && (!serviceForm.serviceImages || serviceForm.serviceImages.length === 0)) {
      Swal.fire("Validation Error", "Please upload at least one image", "error");
      return false;
    }

    return true;
  };

  // IMAGE VALIDATION
  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;

    for (let file of files) {

      if (!allowedTypes.includes(file.type)) {
        Swal.fire("Invalid Image", "Only JPG, PNG, WEBP images allowed", "error");
        return;
      }

      if (file.size > maxSize) {
        Swal.fire("File Too Large", "Image size must be less than 2MB", "error");
        return;
      }

    }

    setServiceForm({
      ...serviceForm,
      serviceImages: files
    });
  };

  return (
    <div className="od-section">

      <div className="od-section-header">
        <h2 className="od-section-title">Service Management</h2>

        <button className="od-btn-add" onClick={() => setShowServiceModal(true)}>
          <FiPlus /> Add Service
        </button>
      </div>

      {/* CATEGORY FILTER */}
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

      {/* SERVICE LIST */}
      <div className="od-card-grid">

        {filteredServices?.map((service) => (

          <div key={service._id} className="od-item-card">

            <div className="od-item-image">
              {service.serviceImages?.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${service.serviceImages[0]}`}
                  alt={service.serviceName}
                  style={{ width: "100%", height: "120px", objectFit: "cover" }}
                />
              ) : (
                <FiScissors />
              )}
            </div>

            <div className="od-item-content">

              <span className={`od-item-category ${service.servicePreferredGender?.toLowerCase()}`}>
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

            <form
              onSubmit={(e) => {

                e.preventDefault();

                if (!validateServiceForm()) return;

                handleServiceSubmit(e);

              }}
            >

              <div className="od-modal-body">

                <div className="od-form-group">
                  <label>Service Name</label>

                  <input
                    type="text"
                    value={serviceForm.serviceName}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        serviceName: e.target.value
                      })
                    }
                  />
                </div>

                <div className="od-form-group">

                  <label>Service Type</label>

                  <select
                    value={serviceForm.serviceType}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        serviceType: e.target.value
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="HAIRCUT">Haircut</option>
                    <option value="BEARD">Beard</option>
                    <option value="FACIAL">Facial</option>
                    <option value="MAKEUP">Makeup</option>
                    <option value="SKIN">Skin</option>
                  </select>

                </div>

                <div className="od-form-group">

                  <label>Description</label>

                  <textarea
                    value={serviceForm.serviceDescription}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        serviceDescription: e.target.value
                      })
                    }
                  />

                </div>

                <div className="od-form-group">

                  <label>Price</label>

                  <input
                    type="number"
                    value={serviceForm.servicePrice}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        servicePrice: e.target.value
                      })
                    }
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
                        serviceDuration: e.target.value
                      })
                    }
                  />

                </div>

                <div className="od-form-group">

                  <label>Preferred Gender</label>

                  <select
                    value={serviceForm.servicePreferredGender}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        servicePreferredGender: e.target.value
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="BOTH">Both</option>
                  </select>

                </div>

                <div className="od-form-group">

                  <label>Service Images</label>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingService}
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

    </div>
  );
};

export default Service;
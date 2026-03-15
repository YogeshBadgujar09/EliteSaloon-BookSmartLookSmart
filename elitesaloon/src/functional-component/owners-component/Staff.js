// functional-component/owners-component/Staff.js
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiX } from "react-icons/fi";

const Staff = ({
  staff,
  setShowStaffModal,
  showStaffModal,
  staffForm,
  setStaffForm,
  handleStaffSubmit,
  editingStaff,
  closeStaffModal,
}) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==================== VALIDATION ====================
  const validateStaffForm = async () => {
    if (!staffForm.staffName.trim()) {
      Swal.fire("Validation Error", "Staff Name is required", "warning");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!staffForm.staffEmail.trim()) {
      Swal.fire("Validation Error", "Email is required", "warning");
      return false;
    }
    if (!emailRegex.test(staffForm.staffEmail)) {
      Swal.fire("Validation Error", "Enter valid email", "warning");
      return false;
    }

    if (!staffForm.staffPhone.trim()) {
      Swal.fire("Validation Error", "Phone number required", "warning");
      return false;
    }

    // ==================== ONLINE PHONE VALIDATION ====================
    try {
      const res = await fetch(
        `https://api.example.com/validateIndianPhone/${staffForm.staffPhone}`,
      ); // Replace with your Postman API
      const data = await res.json();
      if (!data.valid) {
        Swal.fire(
          "Invalid Phone",
          "Please enter a valid Indian phone number",
          "error",
        );
        return false;
      }
    } catch (err) {
      console.error("Phone validation error", err);
      Swal.fire("API Error", "Phone validation API failed", "error");
      return false;
    }

    if (!staffForm.staffAddress || !staffForm.staffAddress.trim()) {
      Swal.fire("Validation Error", "Address is required", "warning");
      return false;
    }

    if (selectedImage) {
      const allowed = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowed.includes(selectedImage.type)) {
        Swal.fire("Invalid Image", "Only JPG or PNG allowed", "error");
        return false;
      }
    }

    return true;
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await validateStaffForm())) return;

    const formData = new FormData();
    formData.append("staffName", staffForm.staffName);
    formData.append("staffEmail", staffForm.staffEmail);
    formData.append("staffPhone", staffForm.staffPhone);
    formData.append("staffAddress", staffForm.staffAddress || "");
    if (selectedImage) formData.append("staffProfile", selectedImage);

    setLoading(true);
    await handleStaffSubmit({ e, formData });
    setLoading(false);
  };

  return (
    <div className="od-section">
      <div className="od-section-header">
        <h2 className="od-section-title">Staff Management</h2>
        <button className="od-btn-add" onClick={() => setShowStaffModal(true)}>
          <FiPlus /> Add Staff
        </button>
      </div>

      {showStaffModal && (
        <div className="od-modal-overlay active" onClick={closeStaffModal}>
          <div className="od-modal" onClick={(e) => e.stopPropagation()}>
            <div className="od-modal-header">
              <h3>{editingStaff ? "Edit Staff" : "Add Staff"}</h3>
              <button className="od-modal-close" onClick={closeStaffModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="od-modal-body">
                {/* PROFILE IMAGE */}
                <div style={{ textAlign: "center", marginBottom: "15px" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      margin: "0 auto",
                      border: "2px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={handleImageClick}
                  >
                    <img
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : editingStaff?.staffProfile
                            ? `http://localhost:5000/${editingStaff.staffProfile}`
                            : "https://via.placeholder.com/120"
                      }
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </div>

                {/* FORM FIELDS */}
                <div className="od-form-group">
                  <label>Staff Name</label>
                  <input
                    type="text"
                    value={staffForm.staffName}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, staffName: e.target.value })
                    }
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
                  />
                </div>

                <div className="od-form-group">
                  <label>Phone (+91)</label>
                  <input
                    type="text"
                    value={staffForm.staffPhone}
                    placeholder="+91 9876543210"
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, staffPhone: e.target.value })
                    }
                  />
                </div>

                <div className="od-form-group">
                  <label>Address</label>
                  <textarea
                    value={staffForm.staffAddress}
                    rows={3}
                    placeholder="Enter staff address"
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffAddress: e.target.value,
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
                  {loading ? "Please wait..." : editingStaff ? "Update" : "Add"}{" "}
                  Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;

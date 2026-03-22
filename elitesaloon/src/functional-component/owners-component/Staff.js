import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiX, FiEdit2, FiTrash2, FiUser } from "react-icons/fi";

const Staff = ({
  staff,
  setShowStaffModal,
  showStaffModal,
  staffForm,
  setStaffForm,
  handleStaffSubmit,
  editingStaff,
  closeStaffModal,
  openEditStaff,
  deleteStaff,
}) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // ================= VALIDATION =================
  const validateStaffForm = () => {
    if (!staffForm.staffName.trim()) {
      Swal.fire("Validation Error", "Staff Name is required", "warning");
      return false;
    }

    if (!staffForm.staffEmail.trim()) {
      Swal.fire("Validation Error", "Email is required", "warning");
      return false;
    }

    if (!staffForm.staffEmail.includes("@")) {
      Swal.fire("Validation Error", "Enter valid email", "error");
      return false;
    }

    if (!staffForm.staffPhone.trim()) {
      Swal.fire("Validation Error", "Phone is required", "warning");
      return false;
    }

    if (staffForm.staffPhone.length !== 10) {
      Swal.fire("Validation Error", "Phone must be 10 digits", "error");
      return false;
    }

    if (!staffForm.staffExperience) {
      Swal.fire("Validation Error", "Experience is required", "warning");
      return false;
    }

    return true;
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // ================= CLOSE MODAL =================
  const handleClose = () => {
    setSelectedImage(null);
    closeStaffModal();
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateStaffForm()) return;

    const formData = new FormData();

    formData.append("staffName", staffForm.staffName);
    formData.append("staffEmail", staffForm.staffEmail);
    formData.append("staffPhone", staffForm.staffPhone);
    formData.append("staffExperience", staffForm.staffExperience);
    formData.append("staffRole", staffForm.staffRole);

    // IMAGE FIX
    if (selectedImage) {
      formData.append("staffProfile", selectedImage);
    } else if (editingStaff?.staffProfile) {
      formData.append("existingProfile", editingStaff.staffProfile);
    }

    handleStaffSubmit(formData);
    setSelectedImage(null);
  };

  return (
    <div className="od-section">
      {/* HEADER */}
      <div className="od-section-header">
        <h2 className="od-section-title">Staff Management</h2>

        <button
          className="od-btn-add"
          onClick={() => {
            setSelectedImage(null);
            setShowStaffModal(true);
          }}
        >
          <FiPlus /> Add Staff
        </button>
      </div>

      {/* STAFF LIST */}
      <div className="od-card-grid">
        {staff.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            No staff added yet
          </p>
        ) : (
          staff.map((member) => (
            <div key={member._id} className="od-item-card">
              <div className="od-item-image">
                {member.staffProfile ? (
                  <img
                    src={`http://localhost:5000/uploads/staffProfiles/${member.staffProfile}`}
                    alt={member.staffName}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <FiUser />
                )}
              </div>

              <div className="od-item-content">
                <h3 className="od-item-name">{member.staffName}</h3>

                <p className="od-item-description">
                  {member.staffRole} • {member.staffExperience} yrs
                </p>

                <div className="od-item-meta">
                  <div>{member.staffEmail}</div>
                  <div>{member.staffPhone}</div>
                </div>

                <div className="od-item-actions">
                  <button
                    className="od-btn od-btn-edit"
                    onClick={() => openEditStaff(member)}
                  >
                    <FiEdit2 /> Edit
                  </button>

                  <button
                    className="od-btn od-btn-delete"
                    onClick={() => deleteStaff(member._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showStaffModal && (
        <div className="od-modal-overlay active" onClick={handleClose}>
          <div className="od-modal" onClick={(e) => e.stopPropagation()}>
            <div className="od-modal-header">
              <h3>{editingStaff ? "Edit Staff" : "Add Staff"}</h3>

              <button className="od-modal-close" onClick={handleClose}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="od-modal-body">

                {/* IMAGE */}
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
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </div>

                {/* NAME */}
                <div className="od-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={staffForm.staffName}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffName: e.target.value,
                      })
                    }
                  />
                </div>

                {/* EMAIL */}
                <div className="od-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={staffForm.staffEmail}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffEmail: e.target.value,
                      })
                    }
                  />
                </div>

                {/* PHONE */}
                <div className="od-form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={staffForm.staffPhone}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffPhone: e.target.value,
                      })
                    }
                  />
                </div>

                {/* ROLE */}
                <div className="od-form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={staffForm.staffRole}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffRole: e.target.value,
                      })
                    }
                  />
                </div>

                {/* EXPERIENCE */}
                <div className="od-form-group">
                  <label>Experience (Years)</label>
                  <input
                    type="number"
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
                  onClick={handleClose}
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

export default Staff;
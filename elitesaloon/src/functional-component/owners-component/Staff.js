import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✅ ADD

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
  const navigate = useNavigate(); // ADD

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("/images/defaultProfile.png");

  // ================= EDIT MODE IMAGE LOAD =================
  useEffect(() => {
    if (editingStaff && editingStaff.staffProfile) {
      setPreview(
        `http://localhost:5000/uploads/staffProfiles/${editingStaff.staffProfile}`
      );
    } else {
      setPreview("/images/defaultProfile.png");
    }

    setSelectedImage(null);
  }, [editingStaff, showStaffModal]);

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

    if (!staffForm.staffAddress || !staffForm.staffAddress.trim()) {
      Swal.fire("Validation Error", "Address is required", "warning");
      return false;
    }

    return true;
  };

  // ================= IMAGE =================
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= CLOSE =================
  const handleClose = () => {
    setSelectedImage(null);
    setPreview("/images/defaultProfile.png");

    setStaffForm({
      staffName: "",
      staffEmail: "",
      staffPhone: "",
      staffAddress: "",
    });

    closeStaffModal();
  };

// ================= SUBMIT (🔥 UPDATED) =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateStaffForm()) return;

    const formData = new FormData();

    formData.append("staffName", staffForm.staffName);
    formData.append("staffEmail", staffForm.staffEmail);
    formData.append("staffPhone", staffForm.staffPhone);
    formData.append("staffAddress", staffForm.staffAddress);

    if (selectedImage) {
      formData.append("staffProfile", selectedImage);
    } else if (editingStaff?.staffProfile) {
      formData.append("existingProfile", editingStaff.staffProfile);
    }

    //   IMPORTANT CHANGE (OTP FLOW)
    handleStaffSubmit(formData, (email) => {
      navigate("/staffotpverify", {
        state: { staffEmail: email },
      });
    });

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
            setPreview("/images/defaultProfile.png");
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
                <img
                  src={
                    member.staffProfile
                      ? `http://localhost:5000/uploads/staffProfiles/${member.staffProfile}`
                      : "/images/defaultProfile.png"
                  }
                  alt={member.staffName}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className="od-item-content">
                <h3 className="od-item-name">{member.staffName}</h3>

                <p className="od-item-description">
                  {member.staffAddress}
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
                      src={preview}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {/* FORM FIELDS */}
                <div className="od-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={staffForm.staffName || ""}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="od-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={staffForm.staffEmail || ""}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="od-form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={staffForm.staffPhone || ""}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffPhone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="od-form-group">
                  <label>Address</label>
                  <textarea
                    rows="3"
                    value={staffForm.staffAddress || ""}
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
                  onClick={handleClose}
                >
                  Cancel
                </button>

                <button type="submit" className="od-btn-save">
                  {editingStaff ? "Update" : "Send OTP"} {/* 🔥 better text */}
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
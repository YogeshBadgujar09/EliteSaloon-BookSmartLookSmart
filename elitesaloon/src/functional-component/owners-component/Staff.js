import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FiPlus, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // ADD

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("/images/defaultProfile.png");

  // ================= EDIT MODE IMAGE LOAD =================
  // ================= EDIT MODE IMAGE LOAD =================
  useEffect(() => {
    if (editingStaff && editingStaff.staffProfile) {
      setPreview(
        `http://localhost:5000/uploads/staffProfiles/${editingStaff.staffProfile}`,
      );
    } else {
      setPreview("/images/defaultProfile.png");
    }

    setSelectedImage(null);
  }, [editingStaff, showStaffModal]);

  // ✅ ADD THIS BELOW
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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

    if (!staffForm.staffPhone || staffForm.staffPhone.length < 12) {
      Swal.fire("Validation Error", "Enter valid phone number", "error");
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

    if (!file) return;

    // ✅ File type check
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire("Invalid Image", "Only JPG, PNG, WEBP allowed", "error");
      return;
    }

    // ✅ File size check (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire("File Too Large", "Image must be less than 2MB", "error");
      return;
    }

    // ✅ Image preview + dimension check
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);

    img.src = imageUrl;

    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        Swal.fire(
          "Small Image",
          "Image must be at least 100x100 pixels",
          "error",
        );
        return;
      }

      // ✅ set state
      setSelectedImage(file);
      setPreview(imageUrl);
    };
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStaffForm()) return;

    setLoading(true);

    try {
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

      await handleStaffSubmit(formData, (email) => {
        navigate("/staffotpverify", {
          state: { staffEmail: email },
        });
      });

      setSelectedImage(null);
    } catch (error) {
      console.log(error);
      console.log("FULL ERROR:", error);
      console.log("BACKEND ERROR:", error.response); // optional but useful

      Swal.fire("Error", error.response?.data?.error || error.message, "error");
    } finally {
      setLoading(false);
    }
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
           <div key={member._id} className="od-item-card od-staff-custom">
              <div className="od-item-image">
                <img
                  src={
                    member.staffProfile === "defaultProfile.png"
                      ? "/images/defaultProfile.png"
                      : `http://localhost:5000/uploads/staffProfiles/${member.staffProfile}`
                  }
                  alt={member.staffName}
                  // style={{
                  //   width: "120px",
                  //   height: "120px",
                  //   objectFit: "cover",
                  //   borderRadius: "50%",
                  // }}
                />
              </div>

              <div className="od-item-content">
  {/* Staff Name */}
  <h3 className="od-item-name">{member.staffName}</h3>

  {/* Staff Details with Labels */}
  <div className="od-item-meta">
    <div>
      <strong>Email:</strong> {member.staffEmail}
    </div>
    <div>
      <strong>Phone:</strong> {member.staffPhone}
    </div>
    <div>
      <strong>Address:</strong> {member.staffAddress}
    </div>
  </div>

  {/* Action Buttons */}
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
                  <PhoneInput
                    country={"in"} // default India
                    value={staffForm.staffPhone}
                    onChange={(phone) =>
                      setStaffForm({ ...staffForm, staffPhone: phone })
                    }
                    inputStyle={{
                      width: "100%",
                    }}
                    enableSearch={true}
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

                <button
                  type="submit"
                  className="od-btn-save"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : editingStaff
                      ? "Update"
                      : "Send OTP"}
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

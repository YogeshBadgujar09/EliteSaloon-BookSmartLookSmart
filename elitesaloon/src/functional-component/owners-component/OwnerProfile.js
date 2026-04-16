// functional-component/owners-component/OwnerProfile.js
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import "./OwnerDashboard.css";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const OwnerProfile = ({ ownerProfile, setOwnerProfile }) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState(ownerProfile);
  const fileInputRef = useRef(null);

  // ✅ sync formData with ownerProfile
  useEffect(() => {
    setFormData(ownerProfile);
  }, [ownerProfile]);

  // ================= UPDATE PROFILE =================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!formData.ownerName?.trim())
      return Swal.fire("Error", "Owner name cannot be empty", "error");

    if (!formData.ownerEmail?.trim())
      return Swal.fire("Error", "Email cannot be empty", "error");

    if (!formData.ownerShopName?.trim())
      return Swal.fire("Error", "Shop name cannot be empty", "error");

    try {
      setLoading(true);
      const data = new FormData();

      data.append("ownerName", formData.ownerName);
      data.append("ownerEmail", formData.ownerEmail);
      data.append("ownerMobile", formData.ownerMobile);
      data.append("ownerShopName", formData.ownerShopName);
      data.append("ownerShopCity", formData.ownerShopCity);
      data.append("ownerShopState", formData.ownerShopState);
      data.append("ownerShopPincode", formData.ownerShopPincode || "");
      data.append("ownerShopDistrict", formData.ownerShopDistrict || "");

      if (selectedImage) {
        data.append("ownerProfileImage", selectedImage);
      }

      const res = await axios.put(
        `http://localhost:5000/owner/update-owner/${ownerProfile._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        Swal.fire("Success", "Profile updated successfully", "success");

        // ✅ ONLY HERE dashboard update hoga
        setOwnerProfile(res.data.data);

        // ✅ localStorage sync
        localStorage.setItem("owner", JSON.stringify(res.data.data));

        setSelectedImage(null);
      } else {
        Swal.fire("Error", "Failed to update profile", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE CLICK =================
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        // ✅ only formData update (NOT ownerProfile)
        setFormData({
          ...formData,
          ownerProfileImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="od-profile-section">
      <div className="od-profile-header">
        <div
          className="od-profile-avatar-wrapper"
          onClick={handleImageClick}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <img
            src={
              formData.ownerProfileImage?.startsWith("data:")
                ? formData.ownerProfileImage
                : !formData.ownerProfileImage ||
                  formData.ownerProfileImage === "defaultProfile.png"
                ? "http://localhost:5000/uploads/default/defaultProfile.png"
                : `http://localhost:5000/uploads/ownerProfile/${formData.ownerProfileImage}?t=${Date.now()}`
            }
            alt="Profile"
            className="od-profile-avatar"
          />
          <div className="od-profile-add-icon">
            <FiPlus />
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="od-profile-details">
          <h2>{ownerProfile.ownerName}</h2>
          <p>{ownerProfile.ownerEmail}</p>
          <p>
            {ownerProfile.ownerShopName} - {ownerProfile.ownerShopCity}
          </p>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate}>
        <div className="od-profile-form">
          {[
            { label: "Owner Name", value: "ownerName" },
            {
              label: "Email",
              value: "ownerEmail",
              type: "email",
              readOnly: true,
            },
            
            { label: "Shop Name", value: "ownerShopName" },
            { label: "City", value: "ownerShopCity", readOnly: true},
            { label: "State", value: "ownerShopState", readOnly: true },
          ].map((field) => (
            <div className="od-form-group" key={field.value}>
              <label>{field.label}</label>
              <input
                type={field.type || "text"}
                value={formData[field.value] || ""}
                readOnly={field.readOnly || false}
                onChange={(e) =>
                  !field.readOnly &&
                  setFormData({
                    ...formData,
                    [field.value]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="od-btn-save"
          style={{ marginTop: "20px" }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default OwnerProfile;
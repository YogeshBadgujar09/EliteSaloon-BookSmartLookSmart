// functional-component/owners-component/OwnerProfile.js
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import "./OwnerDashboard.css"; // reuse same styles

const OwnerProfile = ({ ownerProfile, setOwnerProfile }) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!ownerProfile.ownerName.trim())
      return Swal.fire("Error", "Owner name cannot be empty", "error");
    if (!ownerProfile.ownerEmail.trim())
      return Swal.fire("Error", "Email cannot be empty", "error");
    if (!ownerProfile.ownerShopName.trim())
      return Swal.fire("Error", "Shop name cannot be empty", "error");

    try {
      setLoading(true);
      const formData = new FormData();

      // append all fields
      formData.append("ownerName", ownerProfile.ownerName);
      formData.append("ownerEmail", ownerProfile.ownerEmail);
      formData.append("ownerMobile", ownerProfile.ownerMobile);
      formData.append("ownerShopName", ownerProfile.ownerShopName);
      formData.append("ownerShopCity", ownerProfile.ownerShopCity);
      formData.append("ownerShopState", ownerProfile.ownerShopState);
      formData.append("ownerShopPincode", ownerProfile.ownerShopPincode || "");
      formData.append(
        "ownerShopDistrict",
        ownerProfile.ownerShopDistrict || ""
      );

      if (selectedImage) {
        formData.append("ownerProfileImage", selectedImage);
      }

      const res = await axios.put("/api/owner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        Swal.fire("Success", "Profile updated successfully", "success");
        setOwnerProfile(res.data); // update parent state
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // instant preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setOwnerProfile({
          ...ownerProfile,
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
              ownerProfile.ownerProfileImage
                ? ownerProfile.ownerProfileImage.includes("http")
                  ? ownerProfile.ownerProfileImage
                  : `http://localhost:5000/${ownerProfile.ownerProfileImage}`
                : "https://via.placeholder.com/120"
            }
            alt="Profile"
            className="od-profile-avatar"
          />
          <div className="od-profile-add-icon">
            <FiPlus />
          </div>
        </div>

        {/* hidden file input */}
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
            { label: "Email", value: "ownerEmail", type: "email" },
            { label: "Mobile", value: "ownerMobile" },
            { label: "Shop Name", value: "ownerShopName" },
            { label: "City", value: "ownerShopCity" },
            { label: "State", value: "ownerShopState" },
          ].map((field) => (
            <div className="od-form-group" key={field.value}>
              <label>{field.label}</label>
              <input
                type={field.type || "text"}
                value={ownerProfile[field.value]}
                onChange={(e) =>
                  setOwnerProfile({
                    ...ownerProfile,
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
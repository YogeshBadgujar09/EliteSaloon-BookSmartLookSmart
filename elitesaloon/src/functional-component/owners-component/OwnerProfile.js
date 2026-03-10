// functional-component/owners-component/OwnerProfile.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./OwnerDashboard.css"; // reuse same styles

const OwnerProfile = ({ ownerProfile, setOwnerProfile }) => {
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Simple frontend validation
    if (!ownerProfile.ownerName.trim()) {
      return Swal.fire("Error", "Owner name cannot be empty", "error");
    }
    if (!ownerProfile.ownerEmail.trim()) {
      return Swal.fire("Error", "Email cannot be empty", "error");
    }
    if (!ownerProfile.ownerShopName.trim()) {
      return Swal.fire("Error", "Shop name cannot be empty", "error");
    }

    try {
      setLoading(true);

      // API call to update owner profile
      const res = await axios.put("/api/owner", ownerProfile);

      if (res.status === 200) {
        Swal.fire("Success", "Profile updated successfully", "success");
        setOwnerProfile(res.data); // update local state with latest data
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

  return (
    <div className="od-profile-section">
      <div className="od-profile-header">
        <img
          src="https://via.placeholder.com/120"
          alt="Profile"
          className="od-profile-avatar"
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
          <div className="od-form-group">
            <label>Owner Name</label>
            <input
              type="text"
              value={ownerProfile.ownerName}
              onChange={(e) =>
                setOwnerProfile({
                  ...ownerProfile,
                  ownerName: e.target.value,
                })
              }
            />
          </div>

          <div className="od-form-group">
            <label>Email</label>
            <input
              type="email"
              value={ownerProfile.ownerEmail}
              onChange={(e) =>
                setOwnerProfile({
                  ...ownerProfile,
                  ownerEmail: e.target.value,
                })
              }
            />
          </div>

          <div className="od-form-group">
            <label>Mobile</label>
            <input
              type="text"
              value={ownerProfile.ownerMobile}
              onChange={(e) =>
                setOwnerProfile({
                  ...ownerProfile,
                  ownerMobile: e.target.value,
                })
              }
            />
          </div>

          <div className="od-form-group">
            <label>Shop Name</label>
            <input
              type="text"
              value={ownerProfile.ownerShopName}
              onChange={(e) =>
                setOwnerProfile({
                  ...ownerProfile,
                  ownerShopName: e.target.value,
                })
              }
            />
          </div>

          <div className="od-form-group">
            <label>City</label>
            <input
              type="text"
              value={ownerProfile.ownerShopCity}
              onChange={(e) =>
                setOwnerProfile({
                  ...ownerProfile,
                  ownerShopCity: e.target.value,
                })
              }
            />
          </div>

          <div className="od-form-group">
            <label>State</label>
            <input
              type="text"
              value={ownerProfile.ownerShopState}
              onChange={(e) =>
                setOwnerProfile({
                  ...ownerProfile,
                  ownerShopState: e.target.value,
                })
              }
            />
          </div>
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
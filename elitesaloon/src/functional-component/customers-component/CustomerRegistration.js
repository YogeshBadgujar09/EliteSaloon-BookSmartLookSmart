import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerProfile = ({ customer, setCustomer }) => {

  // ================= STATE =================
  const [formData, setFormData] = useState({
    name: customer.customerName || "",
    email: customer.customerEmail || "",
    phone: customer.customerMobile || "",
    avatar: customer.customerProfileImage || "",

    street: customer.customerStreet || "",
    pincode: customer.customerPincode || "",
    block: customer.customerBlock || "",
    city: customer.customerCity || "",
    district: customer.customerDistrict || "",
    state: customer.customerState || "",
  });

  const [postOffices, setPostOffices] = useState([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.customerName || "",
        email: customer.customerEmail || "",
        phone: customer.customerMobile || "",
        avatar: customer.customerProfileImage || "",

        street: customer.customerStreet || "",
        pincode: customer.customerPincode || "",
        block: customer.customerBlock || "",
        city: customer.customerCity || "",
        district: customer.customerDistrict || "",
        state: customer.customerState || "",
      });
    }
  }, [customer]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "pincode" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ PINCODE API
    if (name === "pincode") {
      if (value.length === 6) {
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${value}`
          );
          const data = await res.json();

          if (data[0].Status === "Success") {
            const offices = data[0].PostOffice;

            setPostOffices(offices);

            const first = offices[0];

            setFormData((prev) => ({
              ...prev,
              district: first?.District || "",
              state: first?.State || "",
              city: "",
              block: "",
            }));
          } else {
            setPostOffices([]);

            setFormData((prev) => ({
              ...prev,
              district: "",
              state: "",
              city: "",
              block: "",
            }));

            alert("Invalid Pincode");
          }
        } catch {
          alert("Pincode API failed");
        }
      } else {
        setPostOffices([]);

        setFormData((prev) => ({
          ...prev,
          district: "",
          state: "",
          city: "",
          block: "",
        }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= IMAGE CLICK =================
  const handleImageClick = () => {
    document.getElementById("imageUpload").click();
  };

  // ================= IMAGE UPLOAD =================
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("customerProfileImage", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/customer/uploadprofile",
        formDataImg,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        const imageUrl = res.data.avatar;

        setFormData((prev) => ({ ...prev, avatar: imageUrl }));
        setCustomer((prev) => ({ ...prev, avatar: imageUrl }));
      }
    } catch (error) {
      console.log(error);
      alert("Image upload failed");
    }
  };

  // ================= PROFILE UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert("Name required");
    if (!formData.email.trim()) return alert("Email required");

    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/customer/update-profile",
        {
          customerName: formData.name,
          customerEmail: formData.email,
          customerMobile: formData.phone,
          customerStreet: formData.street,
          customerPincode: formData.pincode,
          customerBlock: formData.block,
          customerCity: formData.city,
          customerDistrict: formData.district,
          customerState: formData.state,
          customerProfileImage: formData.avatar,
        }
      );

      if (res.status === 200) {
        alert("Profile updated successfully");
        setCustomer(res.data);
      }
    } catch (error) {
      console.log(error);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= PASSWORD UPDATE =================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/customer/change-password",
        passwordData
      );

      if (res.status === 200) {
        alert("Password updated successfully");

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Profile Settings</h2>
      </div>

      <div className="profile-section">

        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={
                formData.avatar
                  ? `http://localhost:5000/uploads/customerProfile/${formData.avatar}?t=${Date.now()}`
                  : "http://localhost:5000/uploads/default/defaultProfile.png"
              }
              alt="profile"
              className="profile-avatar"
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
            />

            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>

            {/* PERSONAL */}
            <h3 className="section-title">Personal Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange}/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange}/>
              </div>
            </div>

            {/* ADDRESS */}
            <h3 className="section-title">Address</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Street</label>
                <input name="street" value={formData.street} onChange={handleChange}/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pincode</label>
                <input name="pincode" maxLength="6" value={formData.pincode} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Village / Block</label>
                <select
                  value={formData.block}
                  onChange={(e) => {
                    const selectedPO = postOffices.find(
                      (po) => po.Name === e.target.value
                    );

                    if (!selectedPO) return;

                    setFormData((prev) => ({
                      ...prev,
                      block: selectedPO.Name,
                      city: selectedPO.Block,
                      district: selectedPO.District,
                      state: selectedPO.State,
                    }));
                  }}
                >
                  <option value="">Select Block</option>
                  {postOffices.map((po, i) => (
                    <option key={i} value={po.Name}>
                      {po.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input value={formData.city} readOnly />
              </div>

              <div className="form-group">
                <label>District</label>
                <input value={formData.district} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input value={formData.state} readOnly />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>

        {/* PASSWORD */}
        <div className="profile-card">
          <h3>Change Password</h3>

          <form onSubmit={handlePasswordSubmit}>
            <input type="password" name="currentPassword" placeholder="Current Password" onChange={handlePasswordChange}/>
            <input type="password" name="newPassword" placeholder="New Password" onChange={handlePasswordChange}/>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handlePasswordChange}/>
            <button type="submit" className="btn-primary">Update Password</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CustomerProfile;
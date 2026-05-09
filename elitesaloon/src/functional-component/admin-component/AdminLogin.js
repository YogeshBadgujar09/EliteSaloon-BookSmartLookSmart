import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loading, startLoading, stopLoading } = useLoader();

  const [form, setForm] = useState({
    adminEmail: "",
    adminPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  // 1. Agar Admin pehle se logged in hai toh redirect karein
  useEffect(() => {
    const isAdminAuth = localStorage.getItem("isAdminAuthenticated");
    if (isAdminAuth === "true") {
      navigate("/admindashboard", { replace: true });
    }
  }, [navigate]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    let err = {};
    if (!form.adminEmail.trim()) {
      err.adminEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.adminEmail)) {
      err.adminEmail = "Enter a valid email address";
    }
    if (!form.adminPassword.trim()) {
      err.adminPassword = "Password is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  /* ================= LOGIN SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all fields correctly.",
      });
      return;
    }

    try {
      startLoading();
      const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Session store karein
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("adminData", JSON.stringify(data.admin));

        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: `Welcome back, ${data.admin.adminName}`,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/admindashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid Email or Password",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Could not connect to the server.",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      {loading && <CommonLoader />}
      <h2>EliteSalon Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Admin Account Login</h3>
          <div className="form-group">
            <input
              type="email"
              name="adminEmail"
              placeholder="Admin Email"
              value={form.adminEmail}
              onChange={handleChange}
            />
            <small className="error-text">{errors.adminEmail}</small>
          </div>

          <div className="form-group password-field">
            <input
              type={showPwd ? "text" : "password"}
              name="adminPassword"
              placeholder="Password"
              value={form.adminPassword}
              onChange={handleChange}
            />
            <span onClick={() => setShowPwd(!showPwd)} className="pwd-toggle">
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </span>
            <small className="error-text">{errors.adminPassword}</small>
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

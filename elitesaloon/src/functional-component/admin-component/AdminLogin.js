import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    adminUsername: "",
    adminPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const { loading, startLoading, stopLoading } = useLoader();

  /* ================= VALIDATION ================= */

  const validate = () => {

    let err = {};

    if (!form.adminUsername.trim()) {
      err.adminUsername = "Username is required";
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

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });

  };

  /* ================= LOGIN ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) {

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please fix the errors"
      });

      return;
    }

    try {

      startLoading();

      const response = await fetch(
        "http://localhost:5000/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            adminUsername: form.adminUsername,
            adminPassword: form.adminPassword
          })
        }
      );

      const data = await response.json();

      const admin = data.admin;

      if (response.ok) {

        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: "Welcome " + admin.adminUsername
        });

        console.log("Login Success:", admin);

        navigate("/admindashboard");

      } else {

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials"
        });

      }

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server"
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

          {/* USERNAME */}
          <div className="form-group">

            <input
              type="text"
              name="adminUsername"
              placeholder="Username"
              value={form.adminUsername}
              onChange={handleChange}
            />

            <small className="error-text">
              {errors.adminUsername}
            </small>

          </div>

          {/* PASSWORD */}
          <div className="form-group password-field">

            <input
              type={showPwd ? "text" : "password"}
              name="adminPassword"
              placeholder="Password"
              value={form.adminPassword}
              onChange={handleChange}
            />

            <span onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </span>

            <small className="error-text">
              {errors.adminPassword}
            </small>

          </div>

        </div>

        <button className="submit-btn" disabled={loading}>

          {loading ? "Logging in..." : "Login"}

        </button>

      </form>

    </div>

  );

};

export default AdminLogin;
import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const OwnerLogin = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    ownerUsername: "",
    ownerPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const { loading, startLoading, stopLoading } = useLoader();

  /* ================= VALIDATION ================= */

  const validate = () => {

    let err = {};
if (!form.ownerUsername.trim()) {
  err.ownerUsername = "Username is required";
}

if (!form.ownerPassword.trim()) {
  err.ownerPassword = "Password is required";
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
        "http://localhost:5000/owner/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ownerUsername: form.ownerUsername,
            ownerPassword: form.ownerPassword
          })
        }
      );

      const data = await response.json();

      const owner = data.owner;

      console.log("Find owner :", data.message);

      if (response.ok) {

        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: "Welcome " + owner.ownerUsername
        });

        console.log("Login Success:", owner);

        navigate("/ownerdashboard");

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

      <h2>EliteSalon Owner Login</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-section">

          <h3>Owner Account Login</h3>

          {/* USERNAME */}
          <div className="form-group">

            <input
              type="text"
              name="ownerUsername"
              placeholder="Username"
              value={form.ownerUsername}
              onChange={handleChange}
            />

            <small className="error-text">
              {errors.ownerUsername}
            </small>

          </div>

          {/* PASSWORD */}
          <div className="form-group password-field">

            <input
              type={showPwd ? "text" : "password"}
              name="ownerPassword"
              placeholder="Password"
              value={form.ownerPassword}
              onChange={handleChange}
            />

            <span onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </span>

            <small className="error-text">
              {errors.ownerPassword}
            </small>

          </div>

          {/* FORGOT PASSWORD */}
          <div className="forgot-link">

            <span onClick={() => navigate("/ownerforgotpassword")}>
              Forgot Password?
            </span>

          </div>

        </div>

        <button className="submit-btn" disabled={loading}>

          {loading ? "Logging in..." : "Login"}

        </button>

      </form>

      {/* REGISTER LINK */}

      <div className="form-links">

        Don’t have an account?{" "}

        <span onClick={() => navigate("/ownerregister")}>
          Register
        </span>

      </div>

    </div>

  );

};

export default OwnerLogin;
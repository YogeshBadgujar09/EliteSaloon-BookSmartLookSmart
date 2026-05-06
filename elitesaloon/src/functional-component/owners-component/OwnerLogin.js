import React, { useState,useEffect } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash ,FaTimes} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const OwnerLogin = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const isAuth = localStorage.getItem("isOwnerAuthenticated");
    const ownerData = localStorage.getItem("owner");

    if (isAuth === "true" && ownerData) {
      
      navigate("/ownerdashboard");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    ownerEmail: "",
    ownerPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const { loading, startLoading, stopLoading } = useLoader();

  /* ================= VALIDATION ================= */

  const validate = () => {
    let err = {};
    if (!form.ownerEmail.trim()) {
      err.ownerEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.ownerEmail)) {
      err.ownerEmail = "Enter valid email";
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
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  /* ================= LOGIN ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please fix the errors",
      });

      return;
    }

    try {
      startLoading();

      const response = await fetch("http://localhost:5000/owner/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerEmail: form.ownerEmail,
          ownerPassword: form.ownerPassword,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      const owner = data.owner;

      console.log("Find owner :", data.message);

      if (response.ok) {
        localStorage.setItem("owner", JSON.stringify(owner));
        localStorage.setItem("ownerId", owner._id); 
  localStorage.setItem("isOwnerAuthenticated", "true");
        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: "Welcome " + owner.ownerEmail,
        });

        console.log("Login Success:", owner);

        navigate("/ownerdashboard", { state: { owner: owner }, replace: true  });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      {loading && <CommonLoader />}
<FaTimes 
  className="close-btn"
  onClick={() => navigate(-1)}
/>
      <h2>EliteSalon Owner Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Owner Account Login</h3>

          {/* USERNAME */}
          <div className="form-group">
            <input
              type="email"
              name="ownerEmail"
              placeholder="Email"
              value={form.ownerEmail}
              onChange={handleChange}
            />

            <small className="error-text">{errors.ownerEmail}</small>
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

            <small className="error-text">{errors.ownerPassword}</small>
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
        <span onClick={() => navigate("/ownerregister")}>Register</span>
      </div>
    </div>
  );
};

export default OwnerLogin;

import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../../components/Form.css";

import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [errors, setErrors] = useState({});

  const { loading, startLoading, stopLoading } = useLoader();

  const customerEmail = location.state?.customerEmail;
  console.log("Email Received at Reset Password", customerEmail);

  const validate = () => {
    let err = {};

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

    if (!newPassword) err.newPassword = "New password required";
    else if (!strongPassword.test(newPassword))
      err.newPassword = "Password must be strong";

    if (!confirmPassword) err.confirmPassword = "Confirm password required";
    else if (confirmPassword !== newPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);

    startLoading();

    try {
      const response = await fetch(
        "http://localhost:5000/customer/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: customerEmail,
            newPassword: newPassword,
          }),
        },
      );

      const data = await response.json();

      console.log("Reset Password Response:", data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful 🎉",
          text: data.message || "You can now login",
        }).then(() => {
          navigate("/customerlogin");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Reset Failed",
          text: data.message || "Unable to reset password",
        });
      }
    } catch (error) {
      console.error("Reset Password Error:", error);

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
      <CommonLoader loading={loading} />

      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group password-field">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <span onClick={() => setShowPwd(!showPwd)}>
            {showPwd ? <FaEyeSlash /> : <FaEye />}
          </span>

          <small className="error-text">{errors.newPassword}</small>
        </div>

        <div className="form-group password-field">
          <input
            type={showCpwd ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <span onClick={() => setShowCpwd(!showCpwd)}>
            {showCpwd ? <FaEyeSlash /> : <FaEye />}
          </span>

          <small className="error-text">{errors.confirmPassword}</small>
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../components/Form.css";

import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [customerEmail, setEmail] = useState("");
  const [error, setError] = useState("");

  const { loading, startLoading, stopLoading } = useLoader();

  const validate = () => {
    if (!customerEmail) {
      setError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      setError("Enter valid email");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      startLoading();

      const response = await fetch(
        "http://localhost:5000/customer/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: customerEmail,
          }),
        },
      );

      const data = await response.json();
      const customerEmailReceived = data.customerEmail;

      console.log("Forgot Password Response Received:", data);
      console.log("Email Received:", customerEmailReceived);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent 📩",
          text: data.message || "OTP sent to your email",
        }).then(() => {
          navigate("/resetOtp", {
            state: { customerEmail: customerEmailReceived },
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:  "Email not found",
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Backend not running",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      <CommonLoader loading={loading} />

      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>For Reset Password Enter Email</h3>

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Registered Email"
              value={customerEmail}
              onChange={(e) => setEmail(e.target.value)}
            />

            <small className="error-text">{error}</small>
          </div>
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

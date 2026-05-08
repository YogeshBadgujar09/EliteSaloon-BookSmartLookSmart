import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const OwnerForgotPassword = () => {
  const navigate = useNavigate();
  const { loading, startLoading, stopLoading } = useLoader();

  const [ownerEmail, setOwnerEmail] = useState("");
  const [error, setError] = useState("");

  /* ================= VALIDATION ================= */

  const validate = () => {
    if (!ownerEmail.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(ownerEmail)) {
      setError("Enter a valid email");
      return false;
    }

    setError("");
    return true;
  };

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      startLoading();

      const response = await fetch(
        "http://localhost:5000/owner/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ownerEmail }),
        }
      );

      // 🔥 SAFE RESPONSE HANDLING (IMPORTANT)
      let data = {};

      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.log("Non-JSON response from server");
        data = { message: "Server error from backend" };
      }

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent 📩",
          text: data.message || "OTP sent successfully",
        }).then(() => {
          navigate("/ownerresetotp", {
            state: { ownerEmail: data.ownerEmail || ownerEmail },
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Backend not responding",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <CommonLoader loading={loading} />

      <div className="form-wrapper login-wrapper">
        
        <h2>Owner Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Enter Registered Email</h3>

            <div className="form-group">
              <input
                type="email"
                placeholder="Enter Owner Email"
                value={ownerEmail}
                onChange={(e) => {
                  setOwnerEmail(e.target.value);
                  setError("");
                }}
              />

              <small className="error-text">{error}</small>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Send OTP
          </button>
        </form>
      </div>
    </>
  );
};

export default OwnerForgotPassword;
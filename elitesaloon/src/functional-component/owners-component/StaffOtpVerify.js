import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import "../../components/Form.css";

const StaffOtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputsRef = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // 📌 Email jo Staff create karte time pass kiya tha
  const staffEmail = location.state?.staffEmail;

  console.log("Staff OTP Page Email:", staffEmail);

  // ================= OTP INPUT =================
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // forward focus
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    // backward focus
    if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ================= VERIFY OTP =================
  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      Swal.fire("Error", "Enter 6 digit OTP", "error");
      return;
    }

    if (!staffEmail) {
      Swal.fire("Error", "Session expired. Add staff again.", "error");
      navigate("/ownerdashboard");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/owner/staff-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffEmail: staffEmail,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", "Staff Verified Successfully 🎉", "success")
          .then(() => {
            navigate("/ownerdashboard", { replace: true });
          });
      } else {
        Swal.fire("Error", data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Server Error", "OTP verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResendOtp = async () => {
    if (!staffEmail) {
      Swal.fire("Error", "Session expired. Add staff again.", "error");
      navigate("/ownerdashboard");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/staff/resendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffEmail: staffEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", "OTP Resent Successfully", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to resend OTP", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Server Error", "Unable to resend OTP", "error");
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      <h2>Verify Staff OTP</h2>

      <div className="form-section">
        <h3>Enter 6 Digit OTP</h3>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="otp-box"
            />
          ))}
        </div>

        <button
          className="submit-btn"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p
          onClick={handleResendOtp}
          style={{
            textAlign: "center",
            marginTop: "15px",
            cursor: "pointer",
            color: "#f8b500",
            fontWeight: "600",
          }}
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
};

export default StaffOtpVerify;
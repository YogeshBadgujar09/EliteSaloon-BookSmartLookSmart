import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";
import usePreventBackNavigation from "../../hooks/usePreventBackNavigation";

const OwnerOtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputsRef = useRef([]);

  usePreventBackNavigation("/");

  const { loading, startLoading, stopLoading } = useLoader();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const ownerEmail = location.state?.ownerEmail;

  console.log("Owner OTP Verification Page :", ownerEmail);

  /* ================= HANDLE OTP INPUT ================= */

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move forward
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  /* ================= BACKSPACE FIX ================= */

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  /* ================= VERIFY OTP ================= */

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    console.log("Entered OTP:", enteredOtp);

    if (!enteredOtp || enteredOtp.length !== 6) {
      Swal.fire("Error", "Please enter 6 digit OTP", "error");
      return;
    }

    if (!ownerEmail) {
      Swal.fire("Error", "Session expired. Please register again.", "error");
      navigate("/ownerregistration");
      return;
    }

    startLoading();

    try {
      const response = await fetch("http://localhost:5000/owner/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerEmail: ownerEmail,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      console.log("Owner OTP Verify Response:", data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Verified Successfully 🎉",
        }).then(() => {
          navigate("/ownerlogin", { replace: true });
        });
      } else {
        Swal.fire("Error", data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.log("OTP Verify Error:", error);

      Swal.fire("Server Error", "Unable to verify OTP", "error");
    } finally {
      stopLoading();
    }
  };

  /* ================= RESEND OTP (UNCHANGED) ================= */

  const handleResendOtp = async () => {
    console.log("Resend OTP clicked");

    if (!ownerEmail) {
      Swal.fire("Error", "Session expired. Please register again.", "error");
      navigate("/ownerregistration");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/owner/resendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerEmail: ownerEmail,
        }),
      });

      const data = await response.json();

      console.log("Resend OTP Response:", data);

      if (response.ok) {
        Swal.fire("Success", "OTP Resent Successfully", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to resend OTP", "error");
      }
    } catch (error) {
      console.log("Resend OTP Error:", error);

      Swal.fire("Server Error", "Unable to resend OTP", "error");
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      {loading && <CommonLoader />}

      <h2>Verify Owner OTP</h2>

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
              onKeyDown={(e) => handleKeyDown(e, index)} // ✅ FIX ADDED
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

export default OwnerOtpVerify;
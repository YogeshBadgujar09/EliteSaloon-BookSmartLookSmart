import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import "../../components/Form.css";

const ResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerEmail = location.state?.customerEmail;

  console.log("Email Received at OTP Page :", customerEmail);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next box automatically
    if (element.value !== "" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ HANDLE SUBMIT WITH BACKEND API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    console.log("Entered OTP:", finalOtp);

    if (finalOtp.length !== 6) {
      Swal.fire("Error", "Enter complete 6 digit OTP", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/customer/verifyotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: customerEmail,
            otp: finalOtp,
          }),
        }
      );

      const data = await response.json();

      console.log("OTP Verify Response:", data);

      if (response.ok) {
        Swal.fire("Success 🎉", "OTP Verified Successfully", "success").then(
          () => {
            navigate("/resetpassword", {
              state: { customerEmail: customerEmail },
            });
          }
        );
      } else {
        Swal.fire("Error", data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error("OTP Verify Error:", error);

      Swal.fire("Server Error", "Unable to verify OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESEND OTP FUNCTION ADDED
  const handleResendOtp = async () => {
    console.log("Resend OTP clicked");

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/customer/resendotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: customerEmail,
          }),
        }
      );

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      <h2>Enter OTP</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-box"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>

        <button
          className="submit-btn"
          style={{ marginTop: "25px" }}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Next"}
        </button>

        {/* ✅ RESEND OTP TEXT ADDED */}
        <p
          onClick={!loading ? handleResendOtp : null}
          style={{
            textAlign: "center",
            marginTop: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            color: "#f8b500",
            fontWeight: "600",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Resend OTP
        </p>
      </form>
    </div>
  );
};

export default ResetOtp;
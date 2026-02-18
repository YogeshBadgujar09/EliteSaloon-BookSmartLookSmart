import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./CustomerForm.css";

const CustomerOtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const inputsRef = useRef([]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  /* ================= VERIFY OTP WITH API ================= */
  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    console.log("Entered OTP:", enteredOtp);

    if (enteredOtp.length !== 6) {
      Swal.fire("Error", "Please enter 6 digit OTP", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts", // replace with real OTP API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: enteredOtp,
            mobile: localStorage.getItem("customerMobileNo"),
            email: localStorage.getItem("customeremail"),
          }),
        }
      );

      const data = await response.json();

      console.log("OTP Verify Response:", data);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Verified Successfully 🎉",
        }).then(() => {
          navigate("/profilesetup");
        });
      } else {
        Swal.fire("Error", "Invalid OTP", "error");
      }

    } catch (error) {
      console.log("OTP Verify Error:", error);

      Swal.fire(
        "Server Error",
        "Unable to verify OTP. Try again later.",
        "error"
      );
    }

    setLoading(false);
  };

  /* ================= RESEND OTP API ================= */
  const handleResendOtp = async () => {

    console.log("Resend OTP clicked");

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts", // replace with real resend API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: localStorage.getItem("customerMobileNo"),
            email: localStorage.getItem("customeremail"),
          }),
        }
      );

      const data = await response.json();

      console.log("Resend OTP Response:", data);

      if (response.ok) {
        Swal.fire("Success", "OTP Resent Successfully", "success");
      } else {
        Swal.fire("Error", "Failed to resend OTP", "error");
      }

    } catch (error) {

      console.log("Resend OTP Error:", error);

      Swal.fire(
        "Server Error",
        "Unable to resend OTP",
        "error"
      );
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      <h2>Verify OTP</h2>

      <div className="form-section">
        <h3>Enter 6-Digit OTP</h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
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
            fontWeight: "600"
          }}
        >
          Resend OTP
        </p>

      </div>
    </div>
  );
};

export default CustomerOtpVerify;

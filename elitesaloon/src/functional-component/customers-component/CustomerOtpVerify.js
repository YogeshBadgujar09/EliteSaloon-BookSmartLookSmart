import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";
import usePreventBackNavigation from "../../hooks/usePreventBackNavigation";

const CustomerOtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputsRef = useRef([]);

  usePreventBackNavigation("/");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const { loading, startLoading, stopLoading } = useLoader();

  const customerEmail = location.state?.customerEmail;

  console.log("Customer OTP Verification Page :", customerEmail);

  /* ================= HANDLE CHANGE ================= */

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
        // move to previous
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      } else {
        // clear current box
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

    if (enteredOtp.length !== 6) {
      Swal.fire("Error", "Please enter 6 digit OTP", "error");
      return;
    }

    startLoading();

    try {
      const response = await fetch("http://localhost:5000/customer/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: customerEmail,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      console.log("OTP Verify Response:", data);

      const customerEmailData = data.customerEmail;

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "OTP Verified Successfully 🎉",
        }).then(() => {
          navigate("/profilesetup", {
            replace: true,
            state: { customerEmailData: customerEmailData },
          });
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
    } finally {
      stopLoading();
    }
  };

  /* ================= RESEND OTP (UNCHANGED) ================= */

  const handleResendOtp = async () => {
    console.log("Resend OTP clicked");

    startLoading();

    try {
      const response = await fetch("http://localhost:5000/customer/resendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: customerEmail,
        }),
      });

      const data = await response.json();

      console.log("Resend OTP Response:", data);

      if (response.ok) {
        Swal.fire("Success", "OTP Resent Successfully", "success");
      } else {
        Swal.fire("Error", "Failed to resend OTP", "error");
      }
    } catch (error) {
      console.log("Resend OTP Error:", error);

      Swal.fire("Server Error", "Unable to resend OTP", "error");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="form-wrapper login-wrapper">
      <CommonLoader loading={loading} />

      <h2>Verify OTP</h2>

      <div className="form-section">
        <h3>Enter 6-Digit OTP</h3>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)} // ✅ FIX
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

export default CustomerOtpVerify;
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import "./Form.css";
import useLoader from "../hooks/useLoader";
import CommonLoader from "./CommonLoader";

const OtpVerify = ({ email, verifyApi, onSuccess }) => {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const { loading, startLoading, stopLoading } = useLoader();

  /* OTP CHANGE */

  const handleChange = (value, index) => {

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  /* VERIFY OTP */

  const handleVerify = async () => {

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      Swal.fire("Error", "Enter 6 digit OTP", "error");
      return;
    }

    startLoading();

    try {

      const response = await fetch(verifyApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          otp: enteredOtp
        })
      });

      const data = await response.json();

      if (response.ok) {

        Swal.fire("Success", "OTP Verified", "success");

        onSuccess(data);

      } else {
        Swal.fire("Error", "Invalid OTP", "error");
      }

    } catch (error) {

      Swal.fire("Server Error", "Try again later", "error");

    } finally {
      stopLoading();
    }

  };

  return (
    <div className="form-wrapper login-wrapper">

      <CommonLoader loading={loading} />

      <h2>Verify OTP</h2>

      <div className="form-section">

        <h3>Enter 6 Digit OTP</h3>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "20px"
        }}>

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

      </div>

    </div>
  );
};

export default OtpVerify;
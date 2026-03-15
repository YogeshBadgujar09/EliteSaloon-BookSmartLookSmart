import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import "../../components/Form.css";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const OwnerResetOtp = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const ownerEmail = location.state?.ownerEmail;

  const { loading, startLoading, stopLoading } = useLoader();

  console.log("Email Received at OTP Page:", ownerEmail);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

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

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      Swal.fire("Error", "Enter complete 6 digit OTP", "error");
      return;
    }

    try {

      startLoading();

      const response = await fetch(
        "http://localhost:5000/owner/verifyotp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerEmail, otp: finalOtp }),
        }
      );

      const data = await response.json();
      console.log("Owner OTP Verify Response:", data);

      if (response.ok) {

        Swal.fire("Success 🎉", "OTP Verified Successfully", "success")
          .then(() => {
            navigate("/ownerresetpassword", { state: { ownerEmail } });
          });

      } else {

        Swal.fire("Error", data.message || "Invalid OTP", "error");

      }

    } catch (error) {

      console.error("Owner OTP Verify Error:", error);

      Swal.fire("Server Error", "Unable to verify OTP", "error");

    } finally {

      stopLoading();

    }

  };

  return (

    <>
      <CommonLoader loading={loading} />

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

        </form>
      </div>

    </>
  );
};

export default OwnerResetOtp;
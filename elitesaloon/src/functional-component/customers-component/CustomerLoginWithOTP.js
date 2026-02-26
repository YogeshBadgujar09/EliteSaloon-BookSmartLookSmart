import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import Swal from "sweetalert2";
import "react-phone-input-2/lib/style.css";
import "./CustomerForm.css";

const CustomerLoginWithOTP = () => {
  const [input, setInput] = useState(""); // email or mobile
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const isEmail = input.includes("@");

  // ---------- GENERATE OTP ----------
  const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  // ---------- SEND OTP ----------
  const sendOtp = () => {
    if (!input) {
      setError("Email or mobile number is required");
      return;
    }

    if (isEmail && !/^\S+@\S+\.\S+$/.test(input)) {
      setError("Enter valid email address");
      return;
    }

    if (!isEmail && input.replace(/\D/g, "").length < 10) {
      setError("Enter valid mobile number");
      return;
    }

    setError("");

    const otpValue = generateOtp();
    setGeneratedOtp(otpValue);
    setStep(2);

    Swal.fire({
      icon: "success",
      title: "OTP Sent ✅",
      html: `
        OTP sent to your ${isEmail ? "email" : "mobile"}<br/>
        <b style="color:red">(Demo OTP: ${otpValue})</b>
      `,
    });
  };

  // ---------- VERIFY OTP ----------
  const verifyOtp = () => {
    if (!otp || otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    if (otp !== generatedOtp) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please try again",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Successful 🎉",
      text: "Welcome to Elite Salon",
    });

    // clear state
    setOtp("");
    setGeneratedOtp("");
  };

  // ---------- RESEND OTP ----------
  const resendOtp = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);

    Swal.fire({
      icon: "info",
      title: "OTP Resent 🔄",
      html: `<b style="color:red">(Demo OTP: ${newOtp})</b>`,
    });
  };

  return (
    <div className="form-wrapper" style={{ maxWidth: "420px" }}>
      <h2>Enter OTP</h2>

      <div className="form-section">
        <h3>{step === 1 ? "Enter Email or Mobile" : "Verify OTP"}</h3>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            {isEmail || input === "" ? (
              <input
                type="text"
                placeholder="Email or Mobile Number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            ) : (
              <PhoneInput
                country="in"
                value={input}
                onChange={setInput}
                inputClass="phone-input"
              />
            )}

            {error && <small className="error-text">{error}</small>}

            <button className="submit-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {error && <small className="error-text">{error}</small>}

            <button className="submit-btn" onClick={verifyOtp}>
              Verify OTP
            </button>

            <p
              style={{
                marginTop: "10px",
                textAlign: "center",
                cursor: "pointer",
                color: "#e91e63",
              }}
              onClick={resendOtp}
            >
              Resend OTP
            </p>
          </>
        )}
      </div>

    </div>
  );
};

export default CustomerLoginWithOTP;

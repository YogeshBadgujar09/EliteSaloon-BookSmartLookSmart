import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./CustomerForm.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter valid email");
      return false;
    }
    setError("");
    return true;
  };

 const handleSubmit = async (e) => {

  e.preventDefault();

  if (!validate()) return;

  console.log("Forgot Password Email:", email);

  try {

    const response = await fetch("http://localhost:8080/api/customer/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    });

    const data = await response.json();

    console.log("Forgot Password Response:", data);

    if (response.ok) {

      // store email for OTP verify page
      localStorage.setItem("resetEmail", email);

      Swal.fire({
        icon: "success",
        title: "OTP Sent 📩",
        text: data.message || "OTP sent to your email"
      }).then(() => {

        navigate("/resetOtp");

      });

    } else {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Email not found"
      });

    }

  } catch (error) {

    console.error("Forgot Password Error:", error);

    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "Backend not running"
    });

  }

};


  return (
    <div className="form-wrapper login-wrapper">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Reset Your Password</h3>

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <small className="error-text">{error}</small>
          </div>
        </div>

        <button className="submit-btn">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;

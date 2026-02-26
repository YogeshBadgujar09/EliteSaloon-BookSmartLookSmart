import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./CustomerForm.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [customerEmail, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!customerEmail) {
      setError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      setError("Enter valid email");
      return false;
    }
    setError("");
    return true;
  };

 const handleSubmit = async (e) => {

  e.preventDefault();

  if (!validate()) return;
  // console.log("Forgot Password Email:", customerEmail);

  try {

    const response = await fetch(
      "http://localhost:5000/customer/forgotpassword",
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerEmail : customerEmail
      })
    });

    const data = await response.json();
    const customerEmailReceived = data.customerEmail;
    
    console.log("Forgot Password Response Received:", data);
    console.log("Email Received:", customerEmailReceived);


    if (response.ok) {

      Swal.fire({
        icon: "success",
        title: "OTP Sent 📩",
        text: "OTP sent to your email" || data.message 
      }).then(() => {

        navigate("/resetOtp", {state : {customerEmail : customerEmailReceived} });

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
              value={customerEmail}
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

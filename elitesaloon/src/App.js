import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Guest
import Navbar from "./functional-component/guest-component/Navbar";
import GuestHome from "./functional-component/guest-component/GuestHome";

// Customer
import CustomerLogin from "./functional-component/customers-component/CustomerLogin";
import CustomerRegistration from "./functional-component/customers-component/CustomerRegistration";
import CustomerLoginWithOTP from "./functional-component/customers-component/CustomerLoginWithOTP";
import CustomerOtpVerify from "./functional-component/customers-component/CustomerOtpVerify";
import CustomerProfileSetup from "./functional-component/customers-component/CustomerProfileSetup";
import ResetPassword from "./functional-component/customers-component/ResetPassword";


// Forgot Password Pages
import ForgotPassword from "./functional-component/customers-component/ForgotPassword";
import ResetOtp from "./functional-component/customers-component/ResetOtp";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* GUEST */}
        <Route path="/" element={<GuestHome />} />

        {/* CUSTOMER */}
        <Route path="/register" element={<CustomerRegistration />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/customerloginotp" element={<CustomerLoginWithOTP />} />
        <Route path="/customerotpverify" element={<CustomerOtpVerify />} />
        <Route path="/profilesetup" element={<CustomerProfileSetup />} />


        {/* FORGOT PASSWORD FLOW */}
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetotp" element={<ResetOtp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />


        {/* ADMIN */}
        <Route path="/admin" element={<h1>Admin Dashboard</h1>} />

        {/* OWNER */}
        <Route path="/owner" element={<h1>Owner Dashboard</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

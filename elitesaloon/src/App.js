import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Guest
import Navbar from "./functional-component/guest-component/Navbar";
import GuestHome from "./functional-component/guest-component/GuestHome";
import Shop from "./functional-component/guest-component/Shop";
import Search from "./functional-component/guest-component/Search";
import Offers from "./functional-component/guest-component/Offers";

// Customer
import CustomerLogin from "./functional-component/customers-component/CustomerLogin";
import CustomerRegistration from "./functional-component/customers-component/CustomerRegistration";
import CustomerLoginWithOTP from "./functional-component/customers-component/CustomerLoginWithOTP";
import CustomerOtpVerify from "./functional-component/customers-component/CustomerOtpVerify";
import CustomerProfileSetup from "./functional-component/customers-component/CustomerProfileSetup";
import ResetPassword from "./functional-component/customers-component/ResetPassword";
import CustomerDashboard from "./functional-component/customers-component/CustomerDashboard";


// Forgot Password Pages
import ForgotPassword from "./functional-component/customers-component/ForgotPassword";
import ResetOtp from "./functional-component/customers-component/ResetOtp";


//Owner 
// import OwnerDashboard from "./functional-component/owner-component/OwnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* GUEST */}
        <Route path="/" element={<GuestHome />} />
         <Route path="/shop" element={<Shop />} />
        <Route path="/search" element={<Search />} />
        <Route path="/offers" element={<Offers />} />

        {/* CUSTOMER */}
        <Route path="/register" element={<CustomerRegistration />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/customerloginotp" element={<CustomerLoginWithOTP />} />
        <Route path="/customerotpverify" element={<CustomerOtpVerify />} />
        <Route path="/profilesetup" element={<CustomerProfileSetup />} />
        <Route path="/customerdashboard" element={<CustomerDashboard />} />



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

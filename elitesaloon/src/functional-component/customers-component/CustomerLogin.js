import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CustomerForm.css";

const CustomerLogin = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= VALIDATION =================
  const validate = () => {

    let err = {};

    if (!form.email) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      err.email = "Enter valid email";
    }

    if (!form.password) {
      err.password = "Password is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };


  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };


  // ================= HANDLE SUBMIT WITH BACKEND =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) {

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please fix the errors"
      });

      return;
    }

    try {

      setLoading(true);

      const response = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {

        // Save token
        localStorage.setItem("token", data.token);

        // Save user info (optional)
        localStorage.setItem("user", JSON.stringify(data.user));

        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: "Welcome " + data.user.name
        });

        console.log("Login Success:", data);

        // redirect to dashboard
        navigate("/dashboard");

      } else {

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials"
        });

      }

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server"
      });

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="form-wrapper login-wrapper">

      <h2>EliteSalon Login</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-section">

          <h3>Account Login</h3>

          {/* EMAIL */}
          <div className="form-group">

            <input
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <small className="error-text">
              {errors.email}
            </small>

          </div>


          {/* PASSWORD */}
          <div className="form-group password-field">

            <input
              type={showPwd ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <span onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </span>

            <small className="error-text">
              {errors.password}
            </small>

          </div>


          {/* FORGOT PASSWORD */}
          <div className="forgot-link">

            <span onClick={() => navigate("/forgotpassword")}>
              Forgot Password?
            </span>

          </div>

        </div>


        <button className="submit-btn" disabled={loading}>

          {loading ? "Logging in..." : "Login"}

        </button>

      </form>


      {/* REGISTER LINK */}
      <div className="form-links">

        Don’t have an account?{" "}

        <span onClick={() => navigate("/register")}>
          Register
        </span>

      </div>

    </div>

  );

};

export default CustomerLogin;

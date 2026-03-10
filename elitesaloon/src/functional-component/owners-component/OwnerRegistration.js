import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-phone-input-2/lib/style.css";
import "../../components/Form.css";
import { useNavigate } from "react-router-dom";
import useLoader from "../../hooks/useLoader";
import CommonLoader from "../../components/CommonLoader";

const OwnerRegistration = () => {

  const { loading, startLoading, stopLoading } = useLoader();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerMobile: "",
    ownerShopName: "",
    ownerShopCertificate: null,
    shopFrontPhoto: null,
    shopInsidePhoto: null,
    ownerShopStreet: "",
    ownerShopPincode: "",
    ownerShopCity: "",
    ownerShopBlock: "",
    ownerShopDistrict: "",
    ownerShopState: "",
    ownerPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [postOffices, setPostOffices] = useState([]);

  /* ================= VALIDATION ================= */

  const validate = () => {

    let err = {};

    if (!form.ownerName.trim())
      err.ownerName = "Owner name required";

    if (!form.ownerEmail)
      err.ownerEmail = "Email required";

    if (!form.ownerMobile || form.ownerMobile.length < 10)
      err.ownerMobile = "Valid mobile required";

    if (!form.ownerShopName)
      err.ownerShopName = "Shop name required";

    if (!form.ownerShopStreet)
      err.ownerShopStreet = "Street required";

    if (!form.ownerShopPincode || form.ownerShopPincode.length !== 6)
      err.ownerShopPincode = "Valid pincode required";

    if (!form.ownerShopBlock)
      err.ownerShopBlock = "Select village/block";

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

    if (!form.ownerPassword)
      err.ownerPassword = "Password required";
    else if (!strongPassword.test(form.ownerPassword))
      err.ownerPassword =
        "Password must contain uppercase, lowercase, number & special character";

    if (form.ownerPassword !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = async (e) => {

    const { name, value, files } = e.target;

    if (name === "ownerShopPincode" && !/^\d*$/.test(value))
      return;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    /* PINCODE API */

    if (name === "ownerShopPincode" && value.length === 6) {

      try {

        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );

        const data = await res.json();

        if (data[0].Status === "Success") {

          const offices = data[0].PostOffice;

          setPostOffices(offices);

          const first = offices[0];

          setForm((prev) => ({
            ...prev,
            ownerShopDistrict: first?.District || "",
            ownerShopState: first?.State || "",
            ownerShopCity: "",
            ownerShopBlock: "",
          }));

        } else {
          Swal.fire("Invalid Pincode", "", "error");
        }

      } catch {
        Swal.fire("API Error", "", "error");
      }
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) {
      Swal.fire("Validation Error", "Fix all fields", "error");
      return;
    }

    try {

      // OWNER OBJECT FOR CONSOLE
      const owner = {

        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        ownerMobile: form.ownerMobile,
        ownerShopName: form.ownerShopName,
        ownerShopStreet: form.ownerShopStreet,
        ownerShopPincode: form.ownerShopPincode,
        ownerShopCity: form.ownerShopCity,
        ownerShopBlock: form.ownerShopBlock,
        ownerShopDistrict: form.ownerShopDistrict,
        ownerShopState: form.ownerShopState,
        ownerPassword: form.ownerPassword
      };

      console.log("Owner Data:", owner);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      if (loading) return;

      startLoading();

      const response = await fetch(
        "http://localhost:5000/owner/ownerregister",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      const ownerEmailReceived = data.ownerEmail;

      console.log("Response Email For OTP:", ownerEmailReceived);

      if (response.ok) {

        Swal.fire({
          title: "Registration Successful",
          text: "OTP Sent Successfully",
          icon: "success",
        }).then(() => {

          sessionStorage.removeItem("otpFlow");

          navigate("/ownerotpverify", {
            replace: true,
            state: { ownerEmail: ownerEmailReceived }
          });

        });

      } else {

        Swal.fire(
          "Registration Failed",
          data.message || "Try again",
          "error"
        );

      }

    } catch (error) {

      console.error(error);

      Swal.fire(
        "Server Error",
        "Backend not responding",
        "error"
      );

    } finally {

      stopLoading();
    }
  };

  return (
    <>
      <CommonLoader loading={loading} />

      <div className="form-wrapper">
        <h2>EliteSalon Owner Registration</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <h3>Personal Details</h3>

            <div className="form-grid">

              <input
                name="ownerName"
                placeholder="Owner Name"
                onChange={handleChange}
              />

              <input
                name="ownerEmail"
                placeholder="Email"
                onChange={handleChange}
              />

              <PhoneInput
                country="in"
                value={form.ownerMobile}
                onChange={(phone) =>
                  setForm((prev) => ({
                    ...prev,
                    ownerMobile: phone,
                  }))
                }
              />

            </div>
          </div>

          <div className="form-section">
            <h3>Shop Details</h3>

            <div className="form-grid">

              <input
                name="ownerShopName"
                placeholder="Shop Name"
                onChange={handleChange}
              />

              <input
                type="file"
                name="ownerShopCertificate"
                 title="Upload Shop Certificate"
                onChange={handleChange}
              />

              <input
                type="file"
                name="shopFrontPhoto"
                 title="Upload Shop Front Photo"
                onChange={handleChange}
              />

              <input
                type="file"
                name="shopInsidePhoto"
                 title="Upload Shop Inside Photo"
                onChange={handleChange}
              />

            </div>
          </div>

          <div className="form-section">
            <h3>Shop Address</h3>

            <div className="form-grid">

              <input
                name="ownerShopStreet"
                placeholder="Street"
                onChange={handleChange}
              />

              <input
                name="ownerShopPincode"
                placeholder="Pincode"
                maxLength="6"
                onChange={handleChange}
              />

              <select
                name="ownerShopBlock"
                value={form.ownerShopBlock}
                onChange={(e) => {

                  const selected = postOffices.find(
                    (po) => po.Name === e.target.value
                  );

                  if (!selected) return;

                  setForm((prev) => ({
                    ...prev,
                    ownerShopBlock: selected.Name,
                    ownerShopCity: selected.Block,
                    ownerShopDistrict: selected.District,
                    ownerShopState: selected.State,
                  }));

                }}
              >

                <option value="">Select Village / Block</option>

                {postOffices.map((po, index) => (
                  <option key={index} value={po.Name}>
                    {po.Name}
                  </option>
                ))}

              </select>

              <input value={form.ownerShopCity} readOnly />
              <input value={form.ownerShopDistrict} readOnly />
              <input value={form.ownerShopState} readOnly />

            </div>
          </div>

          <div className="form-section">
            <h3>Credentials</h3>

            <div className="form-grid">

              <div className="password-group">

                <input
                  type={showPwd ? "text" : "password"}
                  name="ownerPassword"
                  placeholder="Password"
                  onChange={handleChange}
                />

                <span onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </span>

              </div>

              <div className="password-group">

                <input
                  type={showCpwd ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                />

                <span onClick={() => setShowCpwd(!showCpwd)}>
                  {showCpwd ? <FaEyeSlash /> : <FaEye />}
                </span>

              </div>

            </div>
          </div>

          <button className="submit-btn">
            {loading ? "Please wait..." : "Register"}
          </button>

        </form>
      </div>
    </>
  );
};

export default OwnerRegistration;
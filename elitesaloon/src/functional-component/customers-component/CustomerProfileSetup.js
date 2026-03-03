import React, { useState } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerForm.css";
import axios from "axios";
import usePreventBackNavigation from "../../hooks/usePreventBackNavigation";


const CustomerProfileSetup = () => {
  
      const navigate = useNavigate();
      const location = useLocation();

      const [image, setImage] = useState(null);
      const [preview, setPreview] = useState("/images/profileimg.png");// default image 

      usePreventBackNavigation("/"); 
      
      const customerEmail = location.state?.customerEmailData;
    

      // Handle Image Change
      const handleImageChange = (e) => {
        
          const file = e.target.files[0];

          console.log("File Location :" + file);

          if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }
      };

        // Save Profile
      const handleSave = async () => {

        try {
            // const customerEmail = localStorage.getItem("customerEmail");
            console.log("Bring Email in Customer Profile Page :" + customerEmail );
            
            const formData = new FormData();
            formData.append("customerProfileImage", image);
            formData.append("customerEmail", customerEmail);

            await axios.post(
              "http://localhost:5000/customer/uploadprofile",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            Swal.fire({
              icon: "success",
              title: "Profile Setup Completed 🎉",
              text: "Now you can login",
            }).then(() => {
              navigate("/customerlogin",{ replace: true });
            });

        } catch (error) {
            console.log(error);
            Swal.fire("Error", "Image upload failed", "error");
        }
      };


  return (
    <div className="form-wrapper login-wrapper">
      <h2>Setup Your Profile</h2>

      <div style={{ textAlign: "center" }}>
        <div className="profile-container">
          <img src={preview} alt="Profile" className="profile-image" />
        </div>

        <label className="upload-btn">
          Select Profile Picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        <button className="submit-btn" onClick={handleSave}>
          Continue to Login
        </button>
      </div>
    </div>
  );
};

export default CustomerProfileSetup;

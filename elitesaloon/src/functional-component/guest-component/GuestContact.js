import React from "react";
import "./GuestContact.css";

import {
 FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const GuestContact = () => {
  return (
    <section className="guest-contact-section">
      <div className="container">

        <div className="section-header">
         
          <h2 className="section-title contact-title">
           Contact us
          </h2>
        </div>

        <div className="guest-contact-wrapper">

          {/* LEFT SIDE */}
          <div className="contact-info-side">

           

            <div className="contact-info-card">
              <div className="contact-icon-box">
                <FaPhoneAlt />
              </div>

              <div>
                <h3>Call Us</h3>
                <p>+91 82004-88821</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon-box">
                <FaEnvelope />
              </div>

              <div>
                <h3>Email Us</h3>
                <p>elitesaloon18@gmail.com</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon-box">
                <FaClock />
              </div>

              <div>
                <h3>Opening Hours</h3>
                <p>Mon - Sun : 10:00 AM - 9:00 PM</p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="contact-image-side">

            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80"
              alt="Salon"
              className="contact-side-image"
            />

            <div className="contact-image-overlay">
              <h3>Effortless Salon Scheduling</h3>
              <p>
                Relax, refresh and transform yourself
                with Elite Salon professionals.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default GuestContact;
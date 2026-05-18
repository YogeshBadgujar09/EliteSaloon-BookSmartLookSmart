import React from "react";
import { FaCheck } from "react-icons/fa";

const GuestAbout = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="about-content">
              <span className="section-subtitle">About Us</span>
              <h2 className="section-title">Welcome to EliteSalon</h2>
              
              <p>
                At EliteSalon, we are redefining the premium grooming experience by 
                bringing effortless convenience to luxury beauty. We have streamlined 
                our operations to eliminate long waiting times and scheduling conflicts, 
                giving you a seamless, personalized journey from the moment you book.
              </p>
              
              <p>
                Our platform allows both men and women to check real-time availability of 
                their preferred staff members and customize their appointments by selecting 
                multiple luxury services in a single booking. Combined with secure digital 
                payment integrations, we ensure your visit is completely stress-free.
              </p>
              
              <div className="about-features">
                <div className="feature-item">
                  <div className="check-icon-wrapper">
                    <FaCheck className="check-icon" />
                  </div>
                  <span>Real-Time Staff & Time Slot Availability</span>
                </div>
                <div className="feature-item">
                  <div className="check-icon-wrapper">
                    <FaCheck className="check-icon" />
                  </div>
                  <span>Multi-Service Single Appointment Booking</span>
                </div>
                <div className="feature-item">
                  <div className="check-icon-wrapper">
                    <FaCheck className="check-icon" />
                  </div>
                  <span>Secure Online Payments via Razorpay</span>
                </div>
                <div className="feature-item">
                  <div className="check-icon-wrapper">
                    <FaCheck className="check-icon" />
                  </div>
                  <span>Personalized Customer Service History</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="about-images">
              <img
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1000&q=80"
                alt="EliteSalon Luxury Interior"
                className="about-image"
              />
              <div className="about-experience-badge">
                <span className="experience-number">100%</span>
                <span className="experience-text">Seamless Premium Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestAbout;
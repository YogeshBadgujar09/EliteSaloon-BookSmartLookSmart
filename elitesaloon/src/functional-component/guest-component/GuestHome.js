import React from "react";
import "./GuestHome.css";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaQuoteLeft,
} from "react-icons/fa";

const GuestHome = () => {
  return (
    <div className="guest-home">

      {/* ================= HERO SECTION ================= */}
      <section className="hero py-5 text-white position-relative">
        <div className="hero-overlay"></div>
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Elite Salon
              </h1>
              <p className="lead mb-4">
                Luxury beauty experience designed to make you shine with
                confidence and elegance.
              </p>
              <button className="btn btn-warning btn-lg shadow">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED LUXURY IMAGE ================= */}
      <section className="luxury-section py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Experience True Luxury</h2>
          <div className="luxury-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80"
              alt="Luxury Salon Interior"
              className="img-fluid rounded shadow-lg luxury-image"
            />
            <div className="luxury-overlay-text">
              <h3 className="fw-bold">Relax. Refresh. Rejuvenate.</h3>
              <p>Where beauty meets perfection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="services py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Our Premium Services</h2>
          <div className="row g-4">
            {[
              { title: "Skin Care", desc: "Glow with professional facials and treatments." },
              { title: "Hair Styling", desc: "Trendy cuts, colors & hair spa services." },
              { title: "Makeup", desc: "Bridal & party makeup for every occasion." },
              { title: "Hand & Feet", desc: "Manicure, pedicure & nail art designs." },
            ].map((service, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow service-card">
                  <div className="card-body text-center">
                    <h5 className="fw-bold text-danger">{service.title}</h5>
                    <p>{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="about py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">About Elite Salon</h2>
              <p>
                We deliver exceptional beauty services in a relaxing,
                luxurious environment. With over 10 years of expertise,
                our certified professionals ensure every client leaves
                feeling confident and beautiful.
              </p>
              <div className="d-flex align-items-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-warning me-1" />
                ))}
                <span className="ms-2 fw-bold">5.0 Rating (500+ Reviews)</span>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1000&q=80"
                alt="Salon Interior"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="testimonials py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">What Clients Say</h2>
          <div className="row g-4">
            {["Amazing experience and professional staff!",
              "Best salon in town with modern ambiance.",
              "Friendly team and outstanding results!"
            ].map((text, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 shadow h-100">
                  <div className="card-body text-center">
                    <FaQuoteLeft className="text-danger mb-3" size={30} />
                    <p>"{text}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="contact py-5 bg-dark text-white">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Contact Us</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <FaMapMarkerAlt size={40} className="text-warning mb-3" />
              <p>123, Beauty Street, Surat (GJ)</p>
            </div>
            <div className="col-md-4 mb-4">
              <FaPhone size={40} className="text-warning mb-3" />
              <p>+91 1234567890</p>
            </div>
            <div className="col-md-4 mb-4">
              <FaEnvelope size={40} className="text-warning mb-3" />
              <p>elitesaloon18@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GuestHome;

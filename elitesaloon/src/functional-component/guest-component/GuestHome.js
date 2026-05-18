import React, { useRef, useEffect, useState } from "react";
import "./GuestHome.css";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

// Dynamic database components imports
import GuestServices from "./GuestServices";
import GuestProducts from "./GuestProducts";
import GuestAbout from "./GuestAbout";
import GuestFaq from "./GuestFaq";
import GuestContact from "./GuestContact";

const GuestHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const productsRef = useRef(null);
  const aboutRef = useRef(null); // 🔥 NEW: About section ke liye ref
  const contactRef = useRef(null); // 🔥 NEW: Contact section ke liye ref

  const heroSliderImages = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1600&q=80",
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const slideDurationTimer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === heroSliderImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4500);

    return () => clearInterval(slideDurationTimer);
  }, [heroSliderImages.length]);

  // 🔥 UPDATED: Added scroll support for 'about' and 'contact' channels
  useEffect(() => {
    if (location.state?.scrollTo === "services") {
      servicesRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (location.state?.scrollTo === "products") {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (location.state?.scrollTo === "about") {
      aboutRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (location.state?.scrollTo === "contact") {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (location.state?.scrollTo === "home") {
      heroRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const handleProtectedNavigation = (path, state = {}) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      navigate(path, { state });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first",
      }).then(() => {
        navigate("/customerlogin");
      });
    }
  };

  return (
    <div className="guest-home">
      {/* ================= HERO SECTION WITH ACTIVE SLIDER ================= */}
      <section
        className="hero-section"
        ref={heroRef}
        style={{
          backgroundImage: `url(${heroSliderImages[currentSlideIndex]})`,
          transition: "background-image 1.5s ease-in-out",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              EliteSalon <br />
              <span
                className="text-highlight"
                style={{ fontSize: "2.8rem", fontWeight: "500" }}
              >
                Book Smart, Look Smart
              </span>
            </h1>
            <p className="hero-subtitle">
              Real-time slot availability and instant multi-service bookings on
              one seamless salon network.
            </p>
            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() =>
                  handleProtectedNavigation("/customerdashboard", {
                    activeSection: "bookappointments",
                  })
                }
              >
                Book Appointment
              </button>
              <button
                className="btn-secondary"
                onClick={() =>
                  handleProtectedNavigation("/customerdashboard", {
                    activeSection: "services",
                  })
                }
              >
                View Services
              </button>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC INTERACTIVE SLIDER DOT INDICATORS --- */}
        <div
          className="hero-slider-dots-container"
          style={{
            position: "absolute",
            bottom: "35px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
            zIndex: "10",
          }}
        >
          {heroSliderImages.map((_, dotIndex) => (
            <div
              key={dotIndex}
              onClick={() => setCurrentSlideIndex(dotIndex)}
              style={{
                width: currentSlideIndex === dotIndex ? "30px" : "10px",
                height: "6px",
                borderRadius: "3px",
                background:
                  currentSlideIndex === dotIndex
                    ? "var(--primary-gold)"
                    : "rgba(255,255,255,0.35)",
                cursor: "pointer",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ))}
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="services-section" ref={servicesRef}>
        <div className="container">
          <GuestServices
            handleProtectedNavigation={handleProtectedNavigation}
          />
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section className="products-section" ref={productsRef}>
        <div className="container">
          <GuestProducts
            handleProtectedNavigation={handleProtectedNavigation}
          />
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      {/* 🔥 Wrapper div used to firmly hold ref structure hooks */}
      <div ref={aboutRef}>
        <GuestAbout />
      </div>

      {/* ================= FAQ SECTION ================= */}
      <GuestFaq />

      {/* ================= CONTACT SECTION ================= */}
      {/* 🔥 Wrapper div used to firmly hold ref structure hooks */}
      <div ref={contactRef}>
        <GuestContact />
      </div>
    </div>
  );
};

export default GuestHome;

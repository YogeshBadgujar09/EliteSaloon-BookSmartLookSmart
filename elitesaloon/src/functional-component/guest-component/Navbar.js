import React, { useState, useEffect, useRef } from "react"; // 🔥 NEW
import { Link, useLocation } from "react-router-dom";

import "./Navbar.css";
import { FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [showServices, setShowServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const accountRef = useRef(); // 🔥 NEW

  // 🔥 NEW → outside click close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* ===== TOP STRIP ===== */}
      <div className="top-strip">
        <div className="top-strip-content">
          <span>Welcome To EliteSalon </span>
          <div className="top-strip-contact">
            <p>elitesaloon18@gmail.com</p>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <nav className="main-navbar">
        {/* BRAND */}
        <div className="brand">
          <Link to="/" className="brand-text">
            Elite<span className="brand-highlight">Salon</span>
          </Link>
        </div>

        {/* CENTER MENU */}
        <ul className={`menu ${mobileMenuOpen ? "menu-open" : ""}`}>
          <li className={isActive("/") ? "active" : ""}>
            <Link to="/">Home</Link>
          </li>

          <li
            className={`menu-item ${showServices ? "dropdown-active" : ""}`}
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <span className="menu-link">
              Services <span className="dropdown-arrow">▾</span>
            </span>

            {showServices && (
              <div className="dropdown">
                <div className="dropdown-column">
                  <h4>For Her</h4>
                  <Link to="/booking">Hair Styling</Link>
                  <Link to="/booking">Hair Coloring</Link>
                  <Link to="/booking">Facial Treatment</Link>
                  <Link to="/booking">Bridal Makeup</Link>
                  <Link to="/booking">Manicure & Pedicure</Link>
                  <Link to="/booking">Body Spa</Link>
                </div>

                <div className="dropdown-column">
                  <h4>For Him</h4>
                  <Link to="/booking">Haircut & Styling</Link>
                  <Link to="/booking">Beard Styling</Link>
                  <Link to="/booking">Hair Coloring</Link>
                  <Link to="/booking">Facial Treatment</Link>
                  <Link to="/booking">Body Massage</Link>
                  <Link to="/booking">Beard Shave</Link>
                </div>

                <div className="dropdown-column dropdown-image">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80"
                    alt="Salon Services"
                  />
                  <Link to="/booking" className="dropdown-cta">
                    Book Appointment
                  </Link>
                </div>
              </div>
            )}
          </li>

          <li className={isActive("/shop") ? "active" : ""}>
            <Link to="/shop">Shop</Link>
          </li>

          <li className={isActive("/offers") ? "active" : ""}>
            <Link to="/offers">Offers</Link>
          </li>
        </ul>

        {/* RIGHT SECTION */}
        <div className="right-section">
          <Link to="/search" className="icon-link" title="Search">
            <FaSearch />
          </Link>

          {/* 🔥 UPDATED ACCOUNT DROPDOWN */}
          <div className="account-wrapper" ref={accountRef}>
            <div
              className="icon-link"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              <FaUser />
            </div>

            {showAccountMenu && (
              <div className="account-dropdown">
                <Link to="/customerlogin">Customer Login</Link>
                <Link to="/ownerlogin">Owner Login</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";

const Navbar = () => {
  const [showServices, setShowServices] = useState(false);

  return (
    <>
      {/* ===== TOP STRIP ===== */}
      <div className="top-strip">
        Welcome To EliteSalon ✨
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <nav className="main-navbar">

        {/* BRAND */}
        <div className="brand">
          <Link to="/" className="brand-text">
            EliteSalon
          </Link>
        </div>

        {/* CENTER MENU */}
        <ul className="menu">

          <li
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <span>Services ▾</span>

            {showServices && (
              <div className="dropdown">
                <div>
                  <h4>Skin</h4>
                  <p>Facials</p>
                  <p>Clean Up</p>
                  <p>Body Care</p>
                </div>

                <div>
                  <h4>Hair</h4>
                  <p>Haircut</p>
                  <p>Hair Color</p>
                  <p>Hair Spa</p>
                </div>

                <div>
                  <h4>Makeup</h4>
                  <p>Party Makeup</p>
                  <p>Bridal Makeup</p>
                </div>
              </div>
            )}
          </li>

          <li>
            <Link to="/shop">Shop</Link>
          </li>

          <li>
            <Link to="/salon-locator">Salon Locator</Link>
          </li>

          <li>
            <Link to="/offers">Offers</Link>
          </li>

          <li>
            <Link to="/content">Content Hub</Link>
          </li>

        </ul>

        {/* RIGHT SECTION */}
        <div className="right-section">

          <Link to="/search" className="icon-link">
            <FaSearch />
          </Link>

          <Link to="/customerlogin" className="icon-link">
            <FaUser />
          </Link>

          <Link to="/wishlist" className="icon-link">
            <FaHeart />
          </Link>

          <Link to="/cart" className="icon-link">
            <FaShoppingCart />
          </Link>

          <Link to="/booking" className="book-btn">
            BOOK NOW
          </Link>

        </div>

      </nav>
    </>
  );
};

export default Navbar;

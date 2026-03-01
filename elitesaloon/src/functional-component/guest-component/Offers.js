import React, { useState } from "react";
import "./Offers.css";
import { useNavigate } from "react-router-dom";
import {

  FaCalendarAlt,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { offers } from "./OffersData";

const Offers = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredOffers =
    activeFilter === "all"
      ? offers
      : offers.filter((offer) => offer.serviceType === activeFilter);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOfferValid = (validUntil) => {
    return new Date(validUntil) >= new Date();
  };

  const filters = [
    { id: "all", label: "All Offers" },
    { id: "hair", label: "Hair" },
    { id: "skin", label: "Skin Care" },
    { id: "makeup", label: "Makeup" },
    { id: "spa", label: "Spa" },
    { id: "grooming", label: "Grooming" },
    { id: "products", label: "Products" },
  ];

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <section className="offers-hero">
        <div className="offers-hero-overlay"></div>
        <div className="offers-hero-content">
          <h1>
            Special <span className="text-highlight">Offers</span>
          </h1>
          <p>Exclusive deals and promotions for our valued customers</p>
          <div className="offers-breadcrumb">
            <span onClick={() => navigate("/")}>Home</span> /{" "}
            <span>Offers</span>
          </div>
        </div>
      </section>

      {/* Offers Content */}
      <section className="offers-content">
        <div className="container">
          {/* Filter Tabs */}
          <div className="offers-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-tab ${activeFilter === filter.id ? "active" : ""}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Offers Count */}
          <div className="offers-count">
            <span>{filteredOffers.length} offers available</span>
          </div>

          {/* Offers Grid */}
          <div className="offers-grid">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-image-wrapper">
                  <img src={offer.image} alt={offer.title} />
                  <div className="offer-badge">
                    <span className="discount-badge">{offer.discount} OFF</span>
                  </div>
                  {!isOfferValid(offer.validUntil) && (
                    <div className="expired-overlay">
                      <span>Expired</span>
                    </div>
                  )}
                </div>

                <div className="offer-content">
                  <div className="offer-header">
                    <span className="offer-category">{offer.serviceType}</span>
                    {offer.minAmount > 0 && (
                      <span className="min-amount">
                        Min. ₹{offer.minAmount}
                      </span>
                    )}
                  </div>

                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-description">{offer.description}</p>

                  <div className="offer-code-section">
                    <div className="code-display">
                      <span className="code-label">Use Code:</span>
                      <span className="code-value">{offer.code}</span>
                    </div>
                    <button
                      className={`copy-btn ${copiedCode === offer.code ? "copied" : ""}`}
                      onClick={() => copyToClipboard(offer.code)}
                    >
                      {copiedCode === offer.code ? <FaCheck /> : <FaCopy />}
                      {copiedCode === offer.code ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <div className="offer-validity">
                    <FaCalendarAlt className="calendar-icon" />
                    <span>
                      Valid: {formatDate(offer.validFrom)} -{" "}
                      {formatDate(offer.validUntil)}
                    </span>
                  </div>

                  <div className="offer-terms">
                    <strong>Terms:</strong> {offer.terms}
                  </div>

                  <button
                    className="book-offer-btn"
                    onClick={() => navigate("/booking")}
                    disabled={!isOfferValid(offer.validUntil)}
                  >
                    {isOfferValid(offer.validUntil)
                      ? "Book Now"
                      : "Offer Expired"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div className="no-offers">
              <h3>No offers in this category</h3>
              <p>Check back later for new deals!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="offers-cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Subscribe to Our Newsletter</h2>
              <p>
                Get the latest offers and promotions delivered to your inbox
              </p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Offers;

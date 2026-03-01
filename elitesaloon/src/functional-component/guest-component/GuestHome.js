import React, { useState } from "react";
import "./GuestHome.css";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaQuoteLeft,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaRegHeart,
  FaClock,
  FaCheck,

} from "react-icons/fa";
import { femaleServices, maleServices } from "./ServicesData";
import { products } from "./ProductsData";
import { faqs } from "./FaqsData";

const GuestHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("female");
  const [openFaq, setOpenFaq] = useState(null);
  const [productFilter, setProductFilter] = useState("all");
  const [showAllProducts, setShowAllProducts] = useState(false);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredProducts =
    productFilter === "all"
      ? products.slice(0, showAllProducts ? products.length : 8)
      : products
          .filter((p) => {
            if (productFilter === "male") {
              return p.gender === "male" || p.gender === "unisex";
            }
            if (productFilter === "female") {
              return p.gender === "female" || p.gender === "unisex";
            }
            if (productFilter === "unisex") {
              return p.gender === "unisex";
            }
            return true;
          })
          .slice(0, showAllProducts ? products.length : 8);

  const displayedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, 8);

  return (
    <div className="guest-home">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Experience True <span className="text-highlight">Luxury</span>
            </h1>
            <p className="hero-subtitle">
              Where elegance meets expertise. Discover premium beauty and
              grooming services designed for everyone.
            </p>
            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/booking")}
              >
                Book Appointment
              </button>
              <button className="btn-secondary">View Services</button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">What We Offer</span>
            <h2 className="section-title">Our Premium Services</h2>
            <p className="section-description">
              Discover our wide range of beauty and grooming services tailored
              for both men and women
            </p>
          </div>

          {/* Gender Tabs */}
          <div className="gender-tabs">
            <button
              className={`tab-btn ${activeTab === "female" ? "active" : ""}`}
              onClick={() => setActiveTab("female")}
            >
              <span className="tab-icon">👩</span>
              For Her
            </button>
            <button
              className={`tab-btn ${activeTab === "male" ? "active" : ""}`}
              onClick={() => setActiveTab("male")}
            >
              <span className="tab-icon">👨</span>
              For Him
            </button>
          </div>

          {/* Services Grid */}
          <div className="services-grid">
            {(activeTab === "female" ? femaleServices : maleServices).map(
              (service) => (
                <div key={service.id} className="service-card">
                  <div className="service-image-wrapper">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="service-image"
                    />
                    <div className="service-overlay">
                      <span className="service-duration">
                        <FaClock /> {service.duration}
                      </span>
                    </div>
                  </div>
                  <div className="service-content">
                    <span className="service-category">{service.category}</span>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <div className="service-footer">
                      <span className="service-price">{service.price}</span>
                      <button
                        className="service-book-btn"
                        onClick={() => navigate("/booking")}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Take Home</span>
            <h2 className="section-title">Our Products</h2>
            <p className="section-description">
              Premium salon-exclusive products for your beauty routine
            </p>
          </div>

          {/* Product Filters */}
          <div className="product-filters">
            <button
              className={`filter-btn ${productFilter === "all" ? "active" : ""}`}
              onClick={() => {
                setProductFilter("all");
                setShowAllProducts(false);
              }}
            >
              All Products
            </button>
            <button
              className={`filter-btn ${productFilter === "unisex" ? "active" : ""}`}
              onClick={() => {
                setProductFilter("unisex");
                setShowAllProducts(false);
              }}
            >
              Unisex
            </button>
            <button
              className={`filter-btn ${productFilter === "female" ? "active" : ""}`}
              onClick={() => {
                setProductFilter("female");
                setShowAllProducts(false);
              }}
            >
              Women
            </button>
            <button
              className={`filter-btn ${productFilter === "male" ? "active" : ""}`}
              onClick={() => {
                setProductFilter("male");
                setShowAllProducts(false);
              }}
            >
              Men
            </button>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {displayedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-badges">
                    {product.gender === "unisex" && (
                      <span className="badge-unisex">Unisex</span>
                    )}
                    {product.gender === "male" && (
                      <span className="badge-male">For Him</span>
                    )}
                    {product.gender === "female" && (
                      <span className="badge-female">For Her</span>
                    )}
                  </div>
                  <div className="product-actions">
                    <button className="action-btn" title="Add to Wishlist">
                      <FaRegHeart />
                    </button>
                    <button className="action-btn" title="Add to Cart">
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
                <div className="product-content">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <div className="product-rating">
                      <FaStar className="star-icon" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="product-price">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > 8 && (
            <div className="view-more-container">
              <button
                className="view-more-btn"
                onClick={() => setShowAllProducts(!showAllProducts)}
              >
                {showAllProducts ? "Show Less" : "View All Products"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-content">
                <span className="section-subtitle">About Us</span>
                <h2 className="section-title">Welcome to Elite Salon</h2>
                <p>
                  At Elite Salon, we believe that everyone deserves to look and
                  feel their best. With over 10 years of expertise in beauty and
                  grooming, our certified professionals are dedicated to
                  providing exceptional services in a relaxing, luxurious
                  environment.
                </p>
                <p>
                  We take pride in offering personalized experiences for both
                  men and women, using only the finest products and latest
                  techniques to ensure you leave feeling confident and
                  beautiful.
                </p>
                <div className="about-features">
                  <div className="feature-item">
                    <FaCheck className="check-icon" />
                    <span>Certified Professionals</span>
                  </div>
                  <div className="feature-item">
                    <FaCheck className="check-icon" />
                    <span>Premium Products</span>
                  </div>
                  <div className="feature-item">
                    <FaCheck className="check-icon" />
                    <span>Unisex Services</span>
                  </div>
                  <div className="feature-item">
                    <FaCheck className="check-icon" />
                    <span>Hygenic Environment</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-images">
                <img
                  src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1000&q=80"
                  alt="Salon Interior"
                  className="about-image"
                />
                <div className="about-experience-badge">
                  <span className="experience-number">10+</span>
                  <span className="experience-text">Years of Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Help & Support</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`faq-item ${openFaq === faq.id ? "active" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={openFaq === faq.id}
                >
                  <span>{faq.question}</span>
                  {openFaq === faq.id ? <FaMinus /> : <FaPlus />}
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>

          <div className="testimonials-grid">
            {[
              {
                name: "Priya Sharma",
                text: "Amazing experience! The staff is very professional and the salon is so relaxing. I've found my go-to place for all my beauty needs.",
                rating: 5,
              },
              {
                name: "Rahul Verma",
                text: "Best salon for men in town. Great beard styling and hair services. The staff understands exactly what you want.",
                rating: 5,
              },
              {
                name: "Anjali Patel",
                text: "The bridal makeup was absolutely perfect on my wedding day. Thank you Elite Salon for making me feel like a queen!",
                rating: 5,
              },
              {
                name: "Vikram Singh",
                text: "Excellent service and hygiene. The unisex facility is a great initiative. Highly recommend for everyone.",
                rating: 5,
              },
              {
                name: "Meera Nair",
                text: "Love the product range they offer. Staff helped me choose the right products for my hair type.",
                rating: 5,
              },
              {
                name: "Arjun Menon",
                text: "Very professional approach. The body spa experience was rejuvenating. Will definitely come back.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="star-icon" />
                      ))}
                    </div>
                  </div>
                </div>
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEEDBACK SECTION ================= */}
      <section className="feedback-section">
        <div className="container">
          <div className="feedback-wrapper">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="feedback-content">
                  <span className="section-subtitle">Feedback</span>
                  <h2 className="section-title">We Value Your Opinion</h2>
                  <p>
                    Your feedback helps us improve our services. Share your
                    experience with us and help others make informed decisions.
                  </p>
                  <div className="feedback-features">
                    <div className="feedback-feature">
                      <FaCheck className="check-icon" />
                      <span>Quick & Easy Process</span>
                    </div>
                    <div className="feedback-feature">
                      <FaCheck className="check-icon" />
                      <span>Win Exciting Rewards</span>
                    </div>
                    <div className="feedback-feature">
                      <FaCheck className="check-icon" />
                      <span>Help Us Serve You Better</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feedback-form-card">
                  <h3>Leave a Review</h3>
                  <form className="feedback-form">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <select className="form-input" required>
                        <option value="">Select Service</option>
                        <option value="hair">Hair Styling</option>
                        <option value="skin">Skin Care</option>
                        <option value="makeup">Makeup</option>
                        <option value="nails">Nail Care</option>
                        <option value="spa">Spa & Massage</option>
                        <option value="grooming">Men's Grooming</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <textarea
                        placeholder="Share your experience..."
                        className="form-input"
                        rows="4"
                        required
                      ></textarea>
                    </div>
                    <div className="form-rating">
                      <span>Rating:</span>
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className="rating-star" />
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="submit-btn">
                      Submit Feedback
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="contact-section">
        <div className="container">
          <div className="section-header text-white">
            <span className="section-subtitle">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Visit Us</h3>
              <p>123 Beauty Street, Downtown City</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <h3>Call Us</h3>
              <p>+1 (123) 456-7890</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <h3>Email Us</h3>
              <p>info@elitesalon.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Luxury?</h2>
            <p>Book your appointment today and let us pamper you!</p>
            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/booking")}
              >
                Book Now
              </button>
              <button
                className="btn-outline"
                onClick={() => navigate("/customerlogin")}
              >
                Join Membership
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestHome;

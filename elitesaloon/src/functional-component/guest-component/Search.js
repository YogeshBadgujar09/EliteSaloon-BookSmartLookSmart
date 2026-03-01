import React, { useState, useEffect } from "react";
import "./Search.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaStar,
  FaShoppingCart,
  FaRegHeart,
  FaClock,
} from "react-icons/fa";
import { products } from "./ProductsData";
import { femaleServices, maleServices } from "./ServicesData";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({ services: [], products: [] });
  const [activeTab, setActiveTab] = useState("all");
//   const [sortBy, setSortBy] = useState("default");
  const [isSearching, setIsSearching] = useState(false);

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchTerm(query);
    if (query) {
      performSearch(query);
    }
  }, [location.search]);

  // Debounced search
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        performSearch(searchTerm);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults({ services: [], products: [] });
    }
  }, [searchTerm]);

  const performSearch = (query) => {
    const lowerQuery = query.toLowerCase();

    // Search services
    const allServices = [...femaleServices, ...maleServices];
    const matchedServices = allServices.filter(
      (service) =>
        service.title.toLowerCase().includes(lowerQuery) ||
        service.description.toLowerCase().includes(lowerQuery) ||
        service.category.toLowerCase().includes(lowerQuery),
    );

    // Search products
    const matchedProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery),
    );

    setResults({ services: matchedServices, products: matchedProducts });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults({ services: [], products: [] });
  };

  const filteredResults = {
    services:
      activeTab === "all" || activeTab === "services" ? results.services : [],
    products:
      activeTab === "all" || activeTab === "products" ? results.products : [],
  };

  const totalResults =
    filteredResults.services.length + filteredResults.products.length;

  return (
    <div className="search-page">
      {/* Hero/Search Section */}
      <section className="search-hero">
        <div className="search-hero-overlay"></div>
        <div className="search-hero-content">
          <h1>Search</h1>
          <p>Find the perfect services and products for you</p>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search services, products..."
                value={searchTerm}
                onChange={handleInputChange}
                className="search-input"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={clearSearch}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="search-hint">Type at least 2 characters to search</p>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="container">
          {searchTerm.length >= 2 && (
            <>
              {/* Results Header */}
              <div className="results-header">
                <div className="results-info">
                  {isSearching ? (
                    <span>Searching...</span>
                  ) : (
                    <span>
                      {totalResults} results for "{searchTerm}"
                    </span>
                  )}
                </div>

                <div className="results-controls">
                  {/* Tabs */}
                  <div className="result-tabs">
                    <button
                      className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                      onClick={() => setActiveTab("all")}
                    >
                      All ({results.services.length + results.products.length})
                    </button>
                    <button
                      className={`tab-btn ${activeTab === "services" ? "active" : ""}`}
                      onClick={() => setActiveTab("services")}
                    >
                      Services ({results.services.length})
                    </button>
                    <button
                      className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
                      onClick={() => setActiveTab("products")}
                    >
                      Products ({results.products.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* No Results */}
              {totalResults === 0 && !isSearching && (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No results found</h3>
                  <p>
                    We couldn't find any services or products matching "
                    {searchTerm}"
                  </p>
                  <ul className="search-suggestions">
                    <li>Check your spelling</li>
                    <li>Try more general keywords</li>
                    <li>Try different keywords</li>
                  </ul>
                </div>
              )}

              {/* Services Results */}
              {filteredResults.services.length > 0 && (
                <div className="results-group">
                  <h2 className="results-group-title">
                    <FaClock /> Services
                  </h2>
                  <div className="services-grid">
                    {filteredResults.services.map((service) => (
                      <div
                        key={`service-${service.id}`}
                        className="service-card"
                      >
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
                          <span className="service-category">
                            {service.category}
                          </span>
                          <h3 className="service-title">{service.title}</h3>
                          <p className="service-description">
                            {service.description}
                          </p>
                          <div className="service-footer">
                            <span className="service-price">
                              {service.price}
                            </span>
                            <button
                              className="service-book-btn"
                              onClick={() => navigate("/booking")}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Results */}
              {filteredResults.products.length > 0 && (
                <div className="results-group">
                  <h2 className="results-group-title">
                    <FaShoppingCart /> Products
                  </h2>
                  <div className="products-grid">
                    {filteredResults.products.map((product) => (
                      <div
                        key={`product-${product.id}`}
                        className="product-card"
                      >
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
                            <button
                              className="action-btn"
                              title="Add to Wishlist"
                            >
                              <FaRegHeart />
                            </button>
                            <button className="action-btn" title="Add to Cart">
                              <FaShoppingCart />
                            </button>
                          </div>
                        </div>
                        <div className="product-content">
                          <span className="product-category">
                            {product.category}
                          </span>
                          <h3 className="product-name">{product.name}</h3>
                          <p className="product-description">
                            {product.description}
                          </p>
                          <div className="product-footer">
                            <div className="product-rating">
                              <FaStar className="star-icon" />
                              <span>{product.rating}</span>
                            </div>
                            <span className="product-price">
                              {product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Initial State */}
          {searchTerm.length === 0 && (
            <div className="search-initial">
              <div className="initial-icon">🔍</div>
              <h3>Start searching</h3>
              <p>Enter a keyword to find services and products</p>
              <div className="popular-searches">
                <h4>Popular Searches:</h4>
                <div className="search-tags">
                  <button onClick={() => setSearchTerm("hair")}>Hair</button>
                  <button onClick={() => setSearchTerm("spa")}>Spa</button>
                  <button onClick={() => setSearchTerm("facial")}>
                    Facial
                  </button>
                  <button onClick={() => setSearchTerm("makeup")}>
                    Makeup
                  </button>
                  <button onClick={() => setSearchTerm("nail")}>Nail</button>
                  <button onClick={() => setSearchTerm("grooming")}>
                    Grooming
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;

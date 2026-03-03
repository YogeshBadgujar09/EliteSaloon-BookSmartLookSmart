import React, { useState } from "react";
import "./Shop.css";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaRegHeart,
  FaStar,
  FaSortAmountDown,
  FaTimes,
} from "react-icons/fa";
import { products } from "./ProductsData";

const Shop = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Filter products based on search and filters
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesGender =
        genderFilter === "all" ||
        product.gender === genderFilter ||
        product.gender === "unisex";
      return matchesSearch && matchesCategory && matchesGender;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return (
          parseInt(a.price.replace("₹", "")) -
          parseInt(b.price.replace("₹", ""))
        );
      }
      if (sortBy === "price-high") {
        return (
          parseInt(b.price.replace("₹", "")) -
          parseInt(a.price.replace("₹", ""))
        );
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const genders = ["all", "male", "female", "unisex"];

  return (
    <div className="shop-page">
      {/* Hero Section */}
      <section className="shop-hero">
        <div className="shop-hero-overlay"></div>
        <div className="shop-hero-content">
          <h1>
            Our <span className="text-highlight">Products</span>
          </h1>
          <p>Premium salon-exclusive products for your beauty routine</p>
          <div className="shop-breadcrumb">
            <span onClick={() => navigate("/")}>Home</span> / <span>Shop</span>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="shop-content">
        <div className="container">
          {/* Search and Filter Bar */}
          <div className="shop-toolbar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="toolbar-actions">
              <button
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filters
              </button>

              <div className="sort-dropdown">
                <FaSortAmountDown />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <div className={`filters-panel ${showFilters ? "active" : ""}`}>
            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${categoryFilter === cat ? "active" : ""}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat === "all"
                      ? "All"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>For</h4>
              <div className="filter-options">
                {genders.map((gen) => (
                  <button
                    key={gen}
                    className={`filter-btn ${genderFilter === gen ? "active" : ""}`}
                    onClick={() => setGenderFilter(gen)}
                  >
                    {gen === "all"
                      ? "All"
                      : gen.charAt(0).toUpperCase() + gen.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="reset-filters-btn"
              onClick={() => {
                setCategoryFilter("all");
                setGenderFilter("all");
                setSearchTerm("");
                setSortBy("default");
              }}
            >
              Reset Filters
            </button>
          </div>

          {/* Results Count */}
          <div className="results-info">
            <span>Showing {filteredProducts.length} products</span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
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
                      <button
                        className={`action-btn ${wishlist.includes(product.id) ? "active" : ""}`}
                        onClick={() => toggleWishlist(product.id)}
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
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setCategoryFilter("all");
                  setGenderFilter("all");
                  setSearchTerm("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="shop-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h4>Free Shipping</h4>
              <p>On orders above ₹500</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h4>Quality Products</h4>
              <p>100% authentic & salon-approved</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>Best Prices</h4>
              <p>Exclusive member discounts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FaRupeeSign } from "react-icons/fa";

const CustomerProducts = ({ customer, isPreview }) => {
  const navigate = useNavigate();

  const pincode = customer?.customerPincode
    ? Number(customer.customerPincode)
    : "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH API
  useEffect(() => {
    if (!pincode) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/customer/get-product-customer/${pincode}`
        );

        setProducts(res.data.data || []);
      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pincode]);

  // 🔥 BUY NOW
  const handleBuyNow = (product) => {
    navigate("/productcheckout", {
      state: {
        productId: product._id,
        productName: product.productName,
        productPrice: product.productPrice,

        ownerId: product.ownerId?._id,
        shopName: product.ownerId?.ownerShopName,
        ownerEmail: product.ownerId?.ownerEmail,
        address: `${product.ownerId?.ownerShopCity}, ${product.ownerId?.ownerShopPincode}`,
      },
    });
  };

  // ⭐ PREVIEW MODE (ONLY 4 PRODUCTS)
  const displayProducts = isPreview
    ? products.slice(0, 4)
    : products;

  if (loading) {
    return <p className="no-data">Loading products...</p>;
  }

  return (
    <div className="dashboard-content">

    {!isPreview && (
  <div className="content-header">
    <h2>Our Products</h2>
  </div>
)}

      {/* NO DATA */}
      {displayProducts.length === 0 ? (
        <p className="no-data">No products available in your area</p>
      ) : (
        <div className="customer-product-grid">

          {displayProducts.map((product) => (
            <div key={product._id} className="customer-product-card">

              {/* IMAGE */}
              <div className="product-image">
                <img
                  src={
                    product.productImages?.length > 0
                      ? `http://localhost:5000/uploads/productImages/${product.productImages[0]}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={product.productName}
                />
              </div>

              {/* BODY */}
              <div className="product-body">

                <div className="product-content">
                  <div className="shop-name">
                    {product.ownerId?.ownerShopName}
                  </div>

                  <div className="owner-email">
                    {product.ownerId?.ownerEmail}
                  </div>

                  <div className="service-address">
                    📍 {product.ownerId?.ownerShopCity},{" "}
                    {product.ownerId?.ownerShopPincode}
                  </div>

                  <h3>{product.productName}</h3>

                  <p className="desc">{product.productDescription}</p>
                </div>

                <div className="product-footer">
                  <div className="product-meta">
                    <FaRupeeSign /> {product.productPrice}
                  </div>

                  <button
                    className="buy-now-btn"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* SEE MORE (ONLY IN PREVIEW) */}
      {isPreview && (
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <button
            className="view-all-btn"
            onClick={() => navigate("/shop")}
          >
            See More
          </button>
        </div>
      )}

    </div>
  );
};

export default CustomerProducts;
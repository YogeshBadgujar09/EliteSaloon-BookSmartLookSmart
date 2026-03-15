import React from "react";
import { FiShoppingBag, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const Products = ({
  filteredProducts,
  productCategory,
  setProductCategory,
  setShowProductModal,
  openEditProduct,
  deleteProduct,
  getCategoryLabel,
}) => {
  return (
    <div className="od-section">
      <div className="od-section-header">
        <h2 className="od-section-title">Product Management</h2>
        <button className="od-btn-add" onClick={() => setShowProductModal(true)}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="od-card-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="od-item-card">
              <div className="od-item-image">
                <FiShoppingBag />
              </div>

              <div className="od-item-content">
                <span
                  className={`od-item-category ${product.productPreferredGender.toLowerCase()}`}
                >
                  {getCategoryLabel(product.productPreferredGender)}
                </span>

                <h3 className="od-item-name">{product.productName}</h3>

                <p className="od-item-description">{product.productDescription}</p>

                <div className="od-item-meta">
                  <div className="od-item-price">₹{product.productPrice}</div>
                </div>

                <div className="od-item-actions">
                  <button
                    className="od-btn od-btn-edit"
                    onClick={() => openEditProduct(product)}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    className="od-btn od-btn-delete"
                    onClick={() => deleteProduct(product._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="od-empty">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default Products;
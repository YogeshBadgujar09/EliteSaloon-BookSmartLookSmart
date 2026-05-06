import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/get-customers-list");
      setCustomers(res.data.data);
    } catch (error) {
      console.log("Error fetching customers");
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };
 const handleToggleStatus = async () => {
  try {
    const res = await axios.put(
      "http://localhost:5000/admin/customer-status",
      {
        customerId: selectedCustomer._id,
      }
    );

    const updatedCustomer = res.data.data; 

    // update modal
    setSelectedCustomer(updatedCustomer);

    // update table
    setCustomers((prev) =>
      prev.map((c) =>
        c._id === updatedCustomer._id ? updatedCustomer : c
      )
    );
  } catch (e) {
    console.log("Error updating status");
  }
};
  return (
    <div className="ad-content">
      <div className="ad-table-section">
        <div className="ad-section-header">
          <h2 className="ad-section-title">Customer List</h2>
        </div>

        <div className="ad-table-container">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id}>
                  <td>{cust.customerName}</td>
                  <td>{cust.customerUsername}</td>
                  <td>{cust.customerEmail}</td>
                  <td>{cust.customerMobile}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleView(cust)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && selectedCustomer && (
        <div className="modal show d-block custom-modal" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* HEADER */}
              <div className="modal-header">
                <h5 className="modal-title">Customer Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* BODY */}
              <div className="modal-body custom-body">
                {/* PROFILE */}
                <div className="profile-section">
                  <img
                    src={
                      selectedCustomer?.customerProfileImage
                        ? `http://localhost:5000/uploads/customerProfile/${selectedCustomer.customerProfileImage}`
                        : "http://localhost:5000/uploads/default/defaultProfile.png"
                    }
                    alt="profile"
                    className="owner-photo"
                  />
                  <h4>{selectedCustomer.customerName}</h4>
                  <p>@{selectedCustomer.customerUsername}</p>
                </div>

                {/* GRID */}
                <div className="details-grid">
                  <div className="detail-card">
                    <h6>Contact</h6>
                    <p>
                      <span>Email:</span> {selectedCustomer.customerEmail}
                    </p>
                    <p>
                      <span>Mobile:</span> {selectedCustomer.customerMobile}
                    </p>
                  </div>

                  <div className="detail-card">
                    <h6>Personal</h6>
                    <p>
                      <span>Gender:</span> {selectedCustomer.customerGender}
                    </p>
                    <p>
                      <span>DOB:</span>{" "}
                      {new Date(
                        selectedCustomer.customerDOB,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="detail-card full">
                    <h6>Address</h6>
                    <p>{selectedCustomer.customerStreet}</p>
                    <p>
                      {selectedCustomer.customerCity},{" "}
                      {selectedCustomer.customerDistrict}
                    </p>
                    <p>
                      {selectedCustomer.customerState} -{" "}
                      {selectedCustomer.customerPincode}
                    </p>
                  </div>

                  <div className="detail-card">
                    <h6>Status</h6>
                    <p>
                      <span>Account:</span>
                      <span
                        className={
                          selectedCustomer.customerStatus === "active"
                            ? "green"
                            : "red"
                        }
                      >
                        {selectedCustomer.customerStatus === "active"
                          ? "Active"
                          : "Deactivated"}
                      </span>
                    </p>
                    <p>
                      <span>Verified:</span>{" "}
                      {selectedCustomer.customerVerified ? "Yes " : "No "}
                    </p>
                  </div>

                  <div className="detail-card">
                    <h6>System</h6>
                    <p>
                      <span>Created:</span>{" "}
                      {new Date(
                        selectedCustomer.customerCreatedAt,
                      ).toLocaleString()}
                    </p>
                    <p>
                      <span>Updated:</span>{" "}
                      {new Date(
                        selectedCustomer.customerUpdatedAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  className={
                    selectedCustomer.customerStatus === "active"
                      ? "btn btn-danger"
                      : "btn btn-success"
                  }
                  onClick={handleToggleStatus}
                >
                  {selectedCustomer.customerStatus === "active"
                    ? "Deactivate"
                    : "Activate"}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
